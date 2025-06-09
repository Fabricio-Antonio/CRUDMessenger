import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from 'src/notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PeopleModule } from 'src/people/people.module';
import { NotesUtils } from '../notes/notes.utils';
import { AuthModule } from 'src/auth/auth.module';

interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDocker = configService.get<string>('DOCKER_ENV') === 'true';
        const dbConfig: DatabaseConfig = {
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<string>('DB_PORT') || '5432',
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'postgres',
          database: configService.get<string>('DB_NAME') || 'postgres',
        };

        const config = {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: parseInt(dbConfig.port, 10),
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          autoLoadEntities: true,
          synchronize: true,
          ssl: false,
          extra: {
            max: 20,
            connectionTimeoutMillis: 5000,
            query_timeout: 10000,
            statement_timeout: 10000,
          },
          logging: false,
          retryAttempts: 3,
          retryDelay: 3000,
        };

        console.log('Database config:', {
          environment: isDocker ? 'docker' : 'local',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          database: dbConfig.database,
        });
        return config;
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
