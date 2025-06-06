import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TokenPayloadDto } from '../auth/dto/token.payload.dto';

jest.mock('fs/promises');

describe('PeopleService', () => {
  let peopleService: PeopleService;
  let personRepository: Repository<Person>;
  let hashingServiceProtocol: HashingServiceProtocol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    peopleService = module.get<PeopleService>(PeopleService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingServiceProtocol = module.get<HashingServiceProtocol>(
      HashingServiceProtocol,
    );

    jest.spyOn(hashingServiceProtocol, 'hash').mockImplementation(function (
      this: void,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _password: string,
    ) {
      return Promise.resolve('PASSWORDHASH');
    });

    jest.spyOn(personRepository, 'create').mockImplementation(function (
      this: void,
      data: Partial<Person>,
    ) {
      return {
        id: 1,
        name: data.name ?? '',
        email: data.email ?? '',
        passwordHash: data.passwordHash ?? '',
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      } as Person;
    });

    jest.spyOn(personRepository, 'save').mockImplementation(function (
      this: void,
      entity: Person,
    ) {
      return Promise.resolve(entity);
    });

    jest.spyOn(personRepository, 'find').mockImplementation(function (
      this: void,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _options: unknown,
    ) {
      return Promise.resolve([] as Person[]);
    });

    jest.spyOn(personRepository, 'preload').mockImplementation(function (
      this: void,
      data: Partial<Person>,
    ) {
      return Promise.resolve({
        id: data.id ?? 1,
        name: data.name ?? '',
        email: data.email ?? '',
        passwordHash: data.passwordHash ?? '',
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      } as Person);
    });

    jest.spyOn(personRepository, 'remove').mockImplementation(function (
      this: void,
      entity: Person,
    ) {
      return Promise.resolve(entity);
    });

    jest.spyOn(personRepository, 'findOneBy').mockImplementation(function (
      this: void,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _criteria: unknown,
    ) {
      return Promise.resolve(null);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(peopleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'fabricio@email.com',
        name: 'Fabricio',
        password: '123456',
      };
      const passwordHash = 'PASSWORDHASH';
      const newPerson: Person = {
        id: 1,
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash,
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      };

      jest
        .spyOn(hashingServiceProtocol, 'hash')
        .mockResolvedValue(passwordHash);
      jest.spyOn(personRepository, 'create').mockReturnValue(newPerson);

      const result = await peopleService.create(createPersonDto);

      const hashSpy = jest.spyOn(hashingServiceProtocol, 'hash');
      const createSpy = jest.spyOn(personRepository, 'create');
      const saveSpy = jest.spyOn(personRepository, 'save');

      expect(hashSpy).toHaveBeenCalledWith(createPersonDto.password);
      expect(createSpy).toHaveBeenCalledWith({
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash: 'PASSWORDHASH',
      });
      expect(saveSpy).toHaveBeenCalledWith(newPerson);
      expect(result).toEqual(newPerson);
    });

    it('should throw an error if the person already exists with', async () => {
      jest.spyOn(personRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      const createPersonDto: CreatePersonDto = {
        email: 'test@email.com',
        name: 'Test',
        password: '123456',
      };

      await expect(peopleService.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an error if the person already exists with a generic error', async () => {
      jest
        .spyOn(personRepository, 'save')
        .mockRejectedValue(new Error('generic error'));

      const createPersonDto: CreatePersonDto = {
        email: 'test@email.com',
        name: 'Test',
        password: '123456',
      };

      await expect(peopleService.create(createPersonDto)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('findOne', () => {
    it('should return a person was finded', async () => {
      const personId = 1;
      const personFinded: Person = {
        id: personId,
        name: 'Fabricio',
        email: 'fabricio@email.com',
        passwordHash: 'PASSWORDHASH',
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      };

      jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(personFinded);

      const result = await peopleService.findOne(personId);

      expect(result).toEqual(personFinded);
    });

    it('should return not found exception', async () => {
      jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(null);
      await expect(peopleService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all people', async () => {
      const peopleMock: Person[] = [
        {
          id: 1,
          name: 'Fabricio',
          email: 'fabricio@email.com',
          passwordHash: 'PASSWORDHASH',
          noteSent: [],
          noteReceived: [],
          active: true,
          picture: null,
        },
      ];

      jest.spyOn(personRepository, 'find').mockResolvedValue(peopleMock);

      const result = await peopleService.findAll();
      const findSpy = jest.spyOn(personRepository, 'find');

      expect(result).toEqual(peopleMock);
      expect(findSpy).toHaveBeenCalledWith({
        order: { id: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('should update a person if authorizated', async () => {
      const personId = 1;
      const updatePersonDto = { name: 'Fabricio', password: '654321' };
      const tokenPayLoad: TokenPayloadDto = {
        sub: personId.toString(),
        email: 'test@email.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };
      const passwordHash = 'PASSWORDHASH';
      const updatedPerson: Person = {
        id: personId,
        name: 'Fabricio',
        email: 'test@email.com',
        passwordHash,
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      };

      jest
        .spyOn(hashingServiceProtocol, 'hash')
        .mockResolvedValue(passwordHash);
      jest.spyOn(personRepository, 'preload').mockResolvedValue(updatedPerson);
      jest.spyOn(personRepository, 'save').mockResolvedValue(updatedPerson);

      const result = await peopleService.update(
        personId,
        updatePersonDto,
        tokenPayLoad,
      );

      const hashSpy = jest.spyOn(hashingServiceProtocol, 'hash');
      const preloadSpy = jest.spyOn(personRepository, 'preload');
      const saveSpy = jest.spyOn(personRepository, 'save');

      expect(hashSpy).toHaveBeenCalledWith(updatePersonDto.password);
      expect(preloadSpy).toHaveBeenCalledWith({
        id: personId,
        name: updatePersonDto.name,
        passwordHash,
      });
      expect(saveSpy).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
    });

    it('should throw an error if the person is not found', async () => {
      const personId = 1;
      const tokenPayLoad: TokenPayloadDto = {
        sub: personId.toString(),
        email: 'test@email.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };
      const updatePersonDto = { name: 'Fabricio' };

      jest.spyOn(personRepository, 'preload').mockResolvedValue(null);

      await expect(
        peopleService.update(personId, updatePersonDto, tokenPayLoad),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the person is unauthorized', async () => {
      const personId = 1;
      const tokenPayLoad: TokenPayloadDto = {
        sub: '2',
        email: 'test@email.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };
      const updatePersonDto = { name: 'Fabricio' };

      await expect(
        peopleService.update(personId, updatePersonDto, tokenPayLoad),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a person if authorizated', async () => {
      const personId = 1;
      const tokenPayLoad: TokenPayloadDto = {
        sub: personId.toString(),
        email: 'test@email.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };
      const existingPerson: Person = {
        id: personId,
        name: 'Fabricio',
        email: 'test@email.com',
        passwordHash: 'hash',
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      };

      jest.spyOn(peopleService, 'findOne').mockResolvedValue(existingPerson);
      jest.spyOn(personRepository, 'remove').mockResolvedValue(existingPerson);

      const result = await peopleService.remove(personId, tokenPayLoad);

      const findOneSpy = jest.spyOn(peopleService, 'findOne');
      const removeSpy = jest.spyOn(personRepository, 'remove');

      expect(findOneSpy).toHaveBeenCalledWith(personId);
      expect(removeSpy).toHaveBeenCalledWith(existingPerson);
      expect(result).toEqual(existingPerson);
    });

    it('should throw an error if the person is unauthorized', async () => {
      const personId = 1;
      const tokenPayLoad: TokenPayloadDto = {
        sub: '2',
        email: 'test@email.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };
      const existingPerson: Person = {
        id: personId,
        name: 'Fabricio',
        email: 'test@email.com',
        passwordHash: 'hash',
        noteSent: [],
        noteReceived: [],
        active: true,
        picture: null,
      };

      jest.spyOn(peopleService, 'findOne').mockResolvedValue(existingPerson);

      await expect(
        peopleService.remove(personId, tokenPayLoad),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
