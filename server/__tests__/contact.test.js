const request = require('supertest');
const app = require('../index');

describe('POST /api/contact', () => {
  it('should return 200 OK for valid data', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message.',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  it('should return 400 Bad Request for invalid data', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: '',
        email: 'not-an-email',
        message: '',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});
