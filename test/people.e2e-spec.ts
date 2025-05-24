import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PeopleModule } from 'src/people/people.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotesModule } from 'src/notes/notes.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from 'src/app/config/app.config';
import { NoConnectionOptionError } from 'typeorm';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Torna acessível em toda a aplicação
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456',
          database: 'testing',
          autoLoadEntities: true,
          synchronize: true, // NEVER must be true in prod
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        NotesModule,
        PeopleModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/people (POST)', () => {
    it('should create a new person', async () => {
      const createPersonDto = {
        name: 'Fabricio',
        email: 'fabricio@email.com',
        password: '@Bc123456',
      };
      const response = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto);
      expect(response.body).toEqual({
        email: createPersonDto.email,
        name: createPersonDto.name,
        passwordHash: expect.any(String),
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        picture: '',
        id: expect.any(Number),
      });
    });
  });
describe('/people/:id (GET)', () => {
  it('should return unauthorized when user is not logged', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/people')
      .send({
        name: 'Fabricio',
        email: 'fabricio@email.com',
        password: '@Bc123456',
      })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .get('/people/' + personResponse.body.id)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should return the person when user is logged', async () => {
    const createPersonDto = {
      name: 'Fabricio',
      email: 'fabricio@email.com',
      password: '@Bc123456',
    };

    const personResponse = await request(app.getHttpServer())
      .post('/people')
      .send(createPersonDto)
      .expect(HttpStatus.CREATED);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: createPersonDto.email,
        password: createPersonDto.password,
      });

    const response = await request(app.getHttpServer())
      .get('/people/' + personResponse.body.id)
      .set('Authorization', `Bearer ${loginResponse.body.acessToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      email: createPersonDto.email,
      passwordHash: expect.any(String),
      name: createPersonDto.name,
      active: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      picture: '',
      id: expect.any(Number),
    });
  });
});
})