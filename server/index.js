const express = require('express');
const helmet = require('helmet');
const crypto = require('node:crypto');
const { body, validationResult } = require('express-validator');
const { createLogger } = require('./utils/logger');
const { sendContactNotification } = require('./services/contactDispatcher');
const { createRateLimiter } = require('./utils/rateLimiter');

const buildServer = () => {
  const app = express();
  const logger = createLogger({ service: 'ops-contact-api' });

  app.enable('trust proxy');

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const limiter = createRateLimiter({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 5),
    logger,
  });

  app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: { action: 'deny' },
    }),
  );

  if (process.env.ENFORCE_HTTPS === 'true') {
    app.use((req, res, next) => {
      if (req.secure) {
        return next();
      }
      logger.warn('insecure_request_blocked', { requestId: req.id, ip: req.ip });
      return res.status(403).json({ error: 'HTTPS_REQUIRED', requestId: req.id });
    });
  }

  const handleCors = (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
      return next();
    }

    if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');

      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader(
          'Access-Control-Allow-Headers',
          req.headers['access-control-request-headers'] || 'Content-Type',
        );
        return res.status(204).send();
      }

      return next();
    }

    logger.warn('cors_blocked', { origin, requestId: req.id || 'unknown' });
    return res.status(403).json({ error: 'CORS_NOT_ALLOWED', requestId: req.id });
  };

  app.use(handleCors);

  app.use(express.json({ limit: '16kb' }));

  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      logger.info('http_access', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - started,
        requestId: req.id,
      });
    });
    next();
  });

  const contactValidation = [
    body('name')
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage('Name must be between 2 and 120 characters.')
      .escape(),
    body('email')
      .isEmail()
      .withMessage('A valid email is required.')
      .normalizeEmail({ gmail_remove_dots: false }),
    body('message')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters.')
      .escape(),
  ];

  app.post('/api/contact', limiter, contactValidation, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('contact_validation_failed', {
        requestId: req.id,
        errors: errors.array(),
      });
      return res.status(422).json({ errors: errors.array(), requestId: req.id });
    }

    const payload = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      meta: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        requestId: req.id,
      },
    };

    try {
      await sendContactNotification(payload, logger);
      logger.info('contact_enqueued', payload.meta);
      return res.status(202).json({ ok: true, requestId: req.id });
    } catch (error) {
      logger.error('contact_dispatch_failed', {
        requestId: req.id,
        error: error.message,
      });
      return next(error);
    }
  });

  app.use((err, req, res, next) => {
    logger.error('unhandled_error', {
      requestId: req?.id,
      error: err?.message,
    });
    return res.status(500).json({ error: 'SERVER_ERROR', requestId: req?.id });
  });

  return { app, logger };
};

const { app, logger } = buildServer();
const port = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(port, () => {
    logger.info('server_started', { port });
  });
}

module.exports = app;
module.exports.createServer = () => buildServer().app;
