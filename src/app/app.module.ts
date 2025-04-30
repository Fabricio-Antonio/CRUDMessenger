import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from 'src/notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from '../notes/notes.utils';

@Module({
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
  ],
  controllers: [AppController],
  providers: [AppService, NotesUtils],
})
export class AppModule {}
