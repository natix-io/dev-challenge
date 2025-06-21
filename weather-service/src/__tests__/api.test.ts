import app from "../api/app";

const request = require('supertest');

describe('GET /weather (E2E)', () => {
  it('should return weather data for a valid city', async () => {
    const res = await request(app).get('/weather?city=London');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.city).toBe('London');
  });

  it('should return 400 for missing city parameter', async () => {
    const res = await request(app).get('/weather');
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Invalid request query");
  });

  it('should serve from cache on repeated request', async () => {
    await request(app).get('/weather?city=Paris');
    const res = await request(app).get('/weather?city=Paris');
    expect(res.status).toBe(200);
    expect(res.body.meta.source).toBe('cache');
  });

  it('should return 429 if rate limit exceeded', async () => {
    for (let i = 0; i < 101; i++) {
      await request(app).get('/weather?city=Berlin');
    }
    const res = await request(app).get('/weather?city=Berlin');
    expect(res.status).toBe(429);
    expect(res.body.error.message).toMatch(/Rate limit exceeded/);
  });
});
