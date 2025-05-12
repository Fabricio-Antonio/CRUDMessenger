import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPersonDto.password,
      );
      const personData = {
        name: createPersonDto.name,
        passwordHash,
        email: createPersonDto.email,
      };

      const newPerson = this.personRepository.create(personData);
      await this.personRepository.save(newPerson);
      return newPerson;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string };
        if (err.code === '23505') {
          throw new ConflictException('This E-mail already in use');
        }
      }
      throw error;
    }
  }

  async findAll() {
    const people = await this.personRepository.find({
      order: {
        id: 'desc',
      },
    });
    return people;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }
    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const personData = {
      name: updatePersonDto?.name,
    };
    if (updatePersonDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePersonDto.password,
      );

      personData['passwordHash'] = passwordHash;
    }
    const person = await this.personRepository.preload({
      id,
      ...personData,
    });
    if (!person) {
      throw new NotFoundException('Person dont found');
    }

    if (person.id !== Number(tokenPayload.sub)) {
      throw new NotFoundException('You are not this person');
    }
    return this.personRepository.save(person);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.findOne(id);

    if (person.id !== Number(tokenPayload.sub)) {
      throw new NotFoundException('person dont found');
    }
    return this.personRepository.remove(person);
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    const person = await this.findOne(Number(tokenPayload.sub));
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);
    await fs.writeFile(fileFullPath, file.buffer);
    person.picture = fileName;
    await this.personRepository.save(person);
    return person;
  }
}
