import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PeopleService', () => {
  let service: PeopleService;
  let personRepository: Repository<Person>;
  let hashingServiceProtocol: HashingServiceProtocol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        {
          provide: HashingServiceProtocol,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingServiceProtocol = module.get<HashingServiceProtocol>(
      HashingServiceProtocol,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
