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
});
