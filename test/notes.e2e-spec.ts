import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { CreatePersonDto } from '../src/people/dto/create-person.dto';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';
import { UpdateNoteDto } from '../src/notes/dto/update-note.dto';
import { Person } from '../src/people/entities/person.entity';
import { ResponseNoteDto } from '../src/notes/dto/response-note.dto';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

describe('Notes (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdNoteId: number;
  let testPersonId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 30000); // Increase timeout to 30 seconds

  describe('Authentication', () => {
    const testPerson: CreatePersonDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
    };

    it('should create a new person', async () => {
      const response = await request(app.getHttpServer())
        .post('/people')
        .send(testPerson)
        .expect(201);

      testPersonId = response.body.id;
      expect(testPersonId).toBeDefined();
    }, 10000);

    it('should login and get tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: testPerson.email,
          password: testPerson.password,
        })
        .expect(201);

      const authResponse = response.body as AuthResponse;
      expect(authResponse).toHaveProperty('accessToken');
      expect(authResponse).toHaveProperty('refreshToken');
      accessToken = authResponse.accessToken;
    }, 10000);
  });

  describe('Notes CRUD', () => {
    const createNoteDto: CreateNoteDto = {
      text: 'Test note content',
      fromId: 1, // This will be the ID of the first person in the database
    };

    it('should create a new note', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNoteDto)
        .expect(201)
        .expect((res: { body: ResponseNoteDto }) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.text).toBe(createNoteDto.text);
          createdNoteId = res.body.id;
        });
    });

    it('should get all notes', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: { body: ResponseNoteDto[] }) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get a specific note', () => {
      return request(app.getHttpServer())
        .get(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: { body: ResponseNoteDto }) => {
          expect(res.body.id).toBe(createdNoteId);
          expect(res.body.text).toBe(createNoteDto.text);
        });
    });

    it('should update a note', () => {
      const updateNoteDto: UpdateNoteDto = {
        text: 'Updated note content',
        read: true,
      };

      return request(app.getHttpServer())
        .patch(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateNoteDto)
        .expect(200)
        .expect((res: { body: ResponseNoteDto }) => {
          expect(res.body.id).toBe(createdNoteId);
          expect(res.body.text).toBe(updateNoteDto.text);
          expect(res.body.read).toBe(updateNoteDto.read);
        });
    });

    it('should delete a note', () => {
      return request(app.getHttpServer())
        .delete(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: { body: ResponseNoteDto }) => {
          expect(res.body.id).toBe(createdNoteId);
        });
    });

    it('should not find deleted note', () => {
      return request(app.getHttpServer())
        .get(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('Error cases', () => {
    it('should not create note without authentication', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({ text: 'Unauthorized note' })
        .expect(401);
    });

    it('should not get notes without authentication', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .expect(401);
    });

    it('should not update non-existent note', () => {
      return request(app.getHttpServer())
        .patch('/notes/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ text: 'Non-existent note' })
        .expect(404);
    });
  });
});
