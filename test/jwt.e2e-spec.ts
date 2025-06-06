import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { Server } from 'http';

import { AppModule } from '../src/app/app.module';
import { CreatePersonDto } from '../src/people/dto/create-person.dto';
import { AuthResponseDto } from '../src/auth/dto/auth.response.dto';
import { Person } from '../src/people/entities/person.entity';

describe('JWT Authentication (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let personId: number;
  let accessToken = '';
  let refreshToken = '';

  const testPerson: CreatePersonDto = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!@#',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer() as unknown as Server;
  }, 30000);

  afterAll(async () => {
    await app.close();
  }, 30000);

  describe('Authentication Flow', () => {
    it('should create a new person for testing', async () => {
      const response: Response = await request(httpServer)
        .post('/people')
        .send(testPerson)
        .expect(HttpStatus.CREATED);

      const person: Person = response.body as Person;
      personId = person.id;

      expect(person).toHaveProperty('id');
      expect(person.name).toBe(testPerson.name);
      expect(person.email).toBe(testPerson.email);
      expect(person).not.toHaveProperty('password');
    }, 10000);

    it('should fail login with invalid credentials', async () => {
      await request(httpServer)
        .post('/auth')
        .send({
          email: testPerson.email,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should login successfully with valid credentials', async () => {
      const response: Response = await request(httpServer)
        .post('/auth')
        .send({
          email: testPerson.email,
          password: testPerson.password,
        })
        .expect(HttpStatus.CREATED);

      const authResponse: AuthResponseDto = response.body as AuthResponseDto;

      accessToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should access protected route with valid token', async () => {
      await request(httpServer)
        .get('/people')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should fail to access protected route without token', async () => {
      await request(httpServer).get('/people').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail to access protected route with invalid token', async () => {
      await request(httpServer)
        .get('/people')
        .set('Authorization', 'Bearer invalid-token')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should refresh token successfully', async () => {
      const response: Response = await request(httpServer)
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(HttpStatus.CREATED);

      const authResponse: AuthResponseDto = response.body as AuthResponseDto;

      accessToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should fail to refresh token with invalid refresh token', async () => {
      await request(httpServer)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should access protected route with refreshed token', async () => {
      await request(httpServer)
        .get('/people')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should delete the test user', async () => {
      await request(httpServer)
        .delete(`/people/${personId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
