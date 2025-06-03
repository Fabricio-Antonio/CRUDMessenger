import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { CreatePersonDto } from '../src/people/dto/create-person.dto';
import { Person } from '../src/people/entities/person.entity';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

describe('JWT Authentication (e2e)', () => {
  let app: INestApplication;
  let personId: number;
  let accessToken: string;
  let refreshToken: string;

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
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 30000); // Increase timeout to 30 seconds

  describe('Authentication Flow', () => {
    const testPerson: CreatePersonDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    it('should create a new person for testing', async () => {
      const response = await request(app.getHttpServer())
        .post('/people')
        .send(testPerson)
        .expect(HttpStatus.CREATED);

      const person = response.body as Person;
      expect(person).toHaveProperty('id');
      expect(person.name).toBe(testPerson.name);
      expect(person.email).toBe(testPerson.email);
      expect(person).not.toHaveProperty('password');

      personId = person.id;
    }, 10000); // Increase individual test timeout

    it('should fail login with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: testPerson.email,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: testPerson.email,
          password: testPerson.password,
        })
        .expect(HttpStatus.CREATED);

      const authResponse = response.body as AuthResponse;
      expect(authResponse).toHaveProperty('accessToken');
      expect(authResponse).toHaveProperty('refreshToken');

      accessToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;
    });

    it('should access protected route with valid token', async () => {
      await request(app.getHttpServer())
        .get('/people')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should fail to access protected route without token', async () => {
      await request(app.getHttpServer())
        .get('/people')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail to access protected route with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/people')
        .set('Authorization', 'Bearer invalid-token')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should refresh token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(HttpStatus.CREATED);

      const authResponse = response.body as AuthResponse;
      expect(authResponse).toHaveProperty('accessToken');
      expect(authResponse).toHaveProperty('refreshToken');

      // Update tokens for subsequent tests
      accessToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;
    });

    it('should fail to refresh token with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should access protected route with refreshed token', async () => {
      await request(app.getHttpServer())
        .get('/people')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    // Cleanup: Delete the test user
    it('should delete the test user', async () => {
      await request(app.getHttpServer())
        .delete(`/people/${personId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
