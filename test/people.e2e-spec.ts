import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app/app.module';
import { CreatePersonDto } from '../src/people/dto/create-person.dto';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';
import { UpdateNoteDto } from '../src/notes/dto/update-note.dto';
import { Person } from '../src/people/entities/person.entity';
import { ResponseNoteDto } from '../src/notes/dto/response-note.dto';
import { AuthResponseDto } from '../src/auth/dto/auth.response.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let refreshToken: string;
  let personId: number;
  let noteId: number;

  const getServer = (): Server => app.getHttpServer() as unknown as Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  }, 60000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 60000);

  describe('Authentication', () => {
    const createPersonDto: CreatePersonDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: '@Bc123456',
    };

    it('should create a new person', async () => {
      const response = await request(getServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const person = response.body as Person;
      expect(person).toHaveProperty('id');
      expect(person.name).toBe(createPersonDto.name);
      expect(person.email).toBe(createPersonDto.email);
      expect(person).not.toHaveProperty('password');

      personId = person.id;
    });

    it('should login successfully', async () => {
      const response = await request(getServer())
        .post('/auth')
        .send({
          email: createPersonDto.email,
          password: createPersonDto.password,
        })
        .expect(HttpStatus.CREATED);

      const authResponse = response.body as AuthResponseDto;
      expect(authResponse).toHaveProperty('accessToken');
      expect(authResponse).toHaveProperty('refreshToken');

      authToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(getServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(HttpStatus.CREATED);

      const authResponse = response.body as AuthResponseDto;
      expect(authResponse).toHaveProperty('accessToken');
      expect(authResponse).toHaveProperty('refreshToken');

      authToken = authResponse.accessToken;
      refreshToken = authResponse.refreshToken;
    });
  });

  describe('People Management', () => {
    it('should get all people', async () => {
      const response = await request(getServer())
        .get('/people')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      const people = response.body as Person[];
      expect(Array.isArray(people)).toBe(true);
      expect(people.length).toBeGreaterThan(0);
    });

    it('should get person by id', async () => {
      const response = await request(getServer())
        .get(`/people/${personId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      const person = response.body as Person;
      expect(person.id).toBe(personId);
      expect(person.email).toBe('test@example.com');
    });

    it('should update person', async () => {
      const updateData = {
        name: 'Updated Test User',
      };

      const response = await request(getServer())
        .patch(`/people/${personId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      const person = response.body as Person;
      expect(person.name).toBe(updateData.name);
    });
  });

  describe('Notes Management', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test note content',
        fromId: personId,
      };

      const response = await request(getServer())
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createNoteDto)
        .expect(HttpStatus.CREATED);

      const note = response.body as ResponseNoteDto;
      expect(note).toHaveProperty('id');
      expect(note.text).toBe(createNoteDto.text);
      expect(note.read).toBe(false);
      expect(note).toHaveProperty('date');
      expect(note).toHaveProperty('to');
      expect(note).toHaveProperty('from');
      expect(note.to).toHaveProperty('id');
      expect(note.to).toHaveProperty('name');
      expect(note.from).toHaveProperty('id');
      expect(note.from).toHaveProperty('name');

      noteId = note.id;
    });

    it('should get all notes', async () => {
      const response = await request(getServer())
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      const notes = response.body as ResponseNoteDto[];
      expect(Array.isArray(notes)).toBe(true);
      expect(notes.length).toBeGreaterThan(0);
      expect(notes[0]).toHaveProperty('id');
      expect(notes[0]).toHaveProperty('text');
      expect(notes[0]).toHaveProperty('read');
      expect(notes[0]).toHaveProperty('date');
      expect(notes[0]).toHaveProperty('to');
      expect(notes[0]).toHaveProperty('from');
    });

    it('should get note by id', async () => {
      const response = await request(getServer())
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      const note = response.body as ResponseNoteDto;
      expect(note.id).toBe(noteId);
      expect(note.text).toBe('Test note content');
      expect(note.read).toBe(false);
      expect(note).toHaveProperty('date');
      expect(note).toHaveProperty('to');
      expect(note).toHaveProperty('from');
    });

    it('should update note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        text: 'Updated test note content',
        read: true,
      };

      const response = await request(getServer())
        .patch(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateNoteDto)
        .expect(HttpStatus.OK);

      const note = response.body as ResponseNoteDto;
      expect(note.text).toBe(updateNoteDto.text);
      expect(note.read).toBe(updateNoteDto.read);
      expect(note).toHaveProperty('date');
      expect(note).toHaveProperty('to');
      expect(note).toHaveProperty('from');
    });

    it('should delete note', async () => {
      await request(getServer())
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      await request(getServer())
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
