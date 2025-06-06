import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './entities/person.entity';

describe('PeopleController', () => {
  let controller: PeopleController;
  const mockPeopleService: Partial<PeopleService> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    controller = new PeopleController(mockPeopleService as PeopleService);
  });

  it('should create a person with correct argument', async () => {
    const argument: CreatePersonDto = {
      name: 'Test Person',
      email: 'test@example.com',
      password: 'password123',
    };
    const expected: Person = {
      id: 1,
      name: 'Test Person',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      noteSent: [],
      noteReceived: [],
      active: true,
      picture: null,
    };

    jest.spyOn(mockPeopleService, 'create').mockResolvedValue(expected);
    const result = await controller.create(argument);
    expect(result).toEqual(expected);
  });
});
