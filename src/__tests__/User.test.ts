import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user.', async () => {
    const response = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'User Example'
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should not be able to create a user with an existing email.', async () => {
    const response = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'User Example'
    });
    expect(response.status).toBe(400);
  });

  it('Should be able to get all users.', async () => {
    await request(app).post('/users').send({
      email: 'user@example2.com',
      name: 'User Example 2'
    });
    const response = await request(app).get('/users');
    expect(response.body.length).toBe(2);
  });
});
