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
    ConfigModule.forRoot({ isGlobal: true }), // Torna acessível em toda a aplicação
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'prostgres',
      host: 'localhost',
      port: '5432',
      username: 'postgres',
      password: 'testing',
      database: '123456',
      autoLoadEntities: true,
      synchronize: true,
      dropSchemas: true,
    }),
    NotesModule,
    PeopleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotesUtils],
})
export class AppModule {}
