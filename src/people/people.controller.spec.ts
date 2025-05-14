import { PeopleController } from './people.controller';

describe('PeopleController', () => {
  let controller: PeopleController;
  const mockPeopleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    controller = new PeopleController(mockPeopleService as any);
  });
  it('should create a person with correct argument', async () => {
    const argument = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(mockPeopleService, 'create').mockResolvedValue(expected);
    const result = await controller.create(argument as any);
    expect(result).toEqual(expected);
  });
});
