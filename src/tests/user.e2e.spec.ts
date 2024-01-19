import { App } from '../app';
import { boot } from '../main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe('User e2e', () => {
  it('errors out on register with incorrect credentials', async () => {
    const res = await request(application.app).post('/user/register').send({
      name: 'damir',
      email: 'damir@damir.ru',
      password: '123',
    });

    expect(res.statusCode).toBe(422);
  });

  it('logins successfully', async () => {
    const res = await request(application.app).post('/user/login').send({
      email: 'damir@damir.ru',
      password: '123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.jwt).not.toBeUndefined();
  });

  it('errors out if login credentials are incorrect', async () => {
    const res = await request(application.app).post('/user/login').send({
      email: 'wrong@email.com',
      password: '123',
    });

    expect(res.statusCode).not.toBe(200);
  });

  it('errors out if a wrong email format is provided', async () => {
    const res = await request(application.app).post('/user/login').send({
      email: 'email',
      password: '123',
    });

    expect(res.statusCode).not.toBe(200);
  });

  it('errors out if a wrong email format is provided', async () => {
    const res = await request(application.app).post('/user/login').send({
      email: 'email',
      password: '123',
    });

    expect(res.statusCode).not.toBe(200);
  });

  it('errors out if a wrong email format is provided', async () => {
    const success = await request(application.app).post('/user/login').send({
      name: 'damir',
      email: 'damir@damir.ru',
      password: '123',
    });

    const res = await request(application.app)
      .get('/user/info')
      .set('Authorization', `Bearer ${success.body.jwt}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('damir@damir.ru');
  });
});

afterAll(() => {
  application.disconnect();
});
