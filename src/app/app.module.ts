import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from 'src/notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from '../notes/notes.utils';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const isTest = process.env.NODE_ENV === 'test';
        return {
          type: 'postgres',
          host: isTest ? 'localhost' : process.env.DB_HOST || 'postgres',
          port: Number(process.env.DB_PORT) || 5432,
          username: isTest ? 'postgres' : process.env.DB_USERNAME || 'postgres',
          password: isTest ? '123456' : process.env.DB_PASSWORD || '123456',
          database: isTest ? 'testing' : process.env.DB_DATABASE || 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: isTest,
          ssl: !isTest,
          extra: {
            max: 20,
            connectionTimeoutMillis: 5000,
            query_timeout: 10000,
            statement_timeout: 10000,
          },
          logging: isTest ? false : true,
          retryAttempts: isTest ? 1 : 3,
          retryDelay: isTest ? 1000 : 3000,
        };
      },
    }),
    NotesModule,
    PeopleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotesUtils],
})
export class AppModule {}
