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

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const personData = {
        name: createPersonDto.name,
        passwordHash: createPersonDto.password,
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
      throw new NotFoundException('Person dont found');
    }
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const personData = {
      name: updatePersonDto.name,
      passwordHash: updatePersonDto.password,
    };
    const person = await this.personRepository.preload({
      id,
      ...personData,
    });
    if (!person) {
      throw new NotFoundException('Person dont found');
    }
    return this.personRepository.save(person);
  }

  async remove(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('person dont found');
    }
    return this.personRepository.remove(person);
  }
}
