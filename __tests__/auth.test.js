'use strict';

const { app } = require('./../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('./../src/auth/models');
const bcrypt = require('bcrypt');

const request = supertest(app);

beforeAll (async () => {
  await sequelizeDatabase.sync();
});

afterAll (async () => {
  await sequelizeDatabase.drop();
});

describe('Server error handling', () => {
  test('Incorrect method should result in 404', async () => {
    const response = await request.get('/signin');
    expect(response.status).toEqual(404);
  });
  test('Wrong schema should result in 403 error', async () => {
    let response = await request.post('/signup')
      .send({
        name: 'rob',
        password: 'pass',
      })
      .catch(err => console.log(err));
    expect(response.status).toEqual(403);
  });
});

describe('New user POST /signup route', () => {
  test('Testing if new user can sign up with proper username and password', async () => {
    let response = await request.post('/signup')
      .send({
        username: 'rob',
        password: 'pass',
      })
      .catch(err => console.log(err));
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('rob');
    expect(await bcrypt.compare('pass', response.body.password)).toBeTruthy();
  });
  test('No user name and password, should return 403 error', async () => {
    let response = await request.post('/signup');
    expect(response.status).toEqual(403);
    expect(response.body).toEqual({});
  });
});

describe('Existing user POST /signin route', () => {
  test('Testing existing user signin with existing username & password', async () => {
    let response = await request.post('/signin')
      .auth('rob', 'pass')
      .catch(err => console.log(err));
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('rob');
    expect(await bcrypt.compare('pass', response.body.password)).toBeTruthy();
  });
  test('Wrong username and password at signin should return 403 error', async () => {
    let response = await request.post('/signin')
      .auth('rob', 'wrongPass')
      .catch(err => console.log(err));
    expect(response.status).toEqual(403);
    expect(response.body).toEqual({});
  });
});
