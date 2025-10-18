const request = require('supertest');

const buildTestApp = async (env = {}) => {
  jest.resetModules();
  Object.assign(process.env, env);
  // eslint-disable-next-line global-require
  const { createServer } = require('../index');
  return createServer();
};

describe('POST /api/contact', () => {
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a compliant test message.',
  };

  afterEach(() => {
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.RATE_LIMIT_WINDOW_MS;
  });

  it('returns 202 Accepted for valid data', async () => {
    const app = await buildTestApp({ RATE_LIMIT_MAX: '10' });
    const res = await request(app).post('/api/contact').send(validPayload);
    expect(res.statusCode).toBe(202);
    expect(res.body).toEqual(
      expect.objectContaining({
        ok: true,
        requestId: expect.any(String),
      }),
    );
  });

  it('returns 422 Unprocessable Entity for invalid data', async () => {
    const app = await buildTestApp({ RATE_LIMIT_MAX: '10' });
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '', email: 'invalid', message: 'short' });

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.any(Array),
        requestId: expect.any(String),
      }),
    );
  });

  it('throttles requests beyond the configured limit', async () => {
    const limit = 2;
    const app = await buildTestApp({ RATE_LIMIT_MAX: String(limit) });

    for (let i = 0; i < limit; i += 1) {
      const response = await request(app).post('/api/contact').send(validPayload);
      expect(response.statusCode).toBe(202);
    }

    const blocked = await request(app).post('/api/contact').send(validPayload);
    expect(blocked.statusCode).toBe(429);
    expect(blocked.body).toEqual(
      expect.objectContaining({ error: 'RATE_LIMIT_EXCEEDED' }),
    );
  });
});
