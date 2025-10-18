const createRateLimiter = ({ windowMs, max, logger }) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.connection?.remoteAddress || 'unknown';
    const entry = hits.get(key);

    if (!entry || entry.resetTime <= now) {
      const resetTime = now + windowMs;
      hits.set(key, { count: 1, resetTime });
      const timeout = setTimeout(() => {
        const current = hits.get(key);
        if (current && current.resetTime === resetTime) {
          hits.delete(key);
        }
      }, windowMs);
      timeout.unref?.();
    } else {
      entry.count += 1;
    }

    const { count, resetTime } = hits.get(key);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(max - count, 0));
    res.setHeader('RateLimit-Reset', Math.ceil(resetTime / 1000));

    if (count > max) {
      logger?.warn('rate_limited', { ip: key, requestId: req.id });
      return res.status(429).json({ error: 'RATE_LIMIT_EXCEEDED', requestId: req.id });
    }

    return next();
  };
};

module.exports = { createRateLimiter };
