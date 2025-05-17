import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PeopleModule } from 'src/people/people.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotesModule } from 'src/notes/notes.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import appConfig from 'src/app/config/app.config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Torna acessível em toda a aplicação
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: Boolean(process.env.DB_AUTOLOAD_ENTITIES),
          synchronize: Boolean(process.env.DB_SYNCHRONIZE), // NEVER must be true in prod
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

  it('/ (GET)', () => {
    //
  });
});
