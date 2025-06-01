import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesUtils } from './notes.utils'; 
import { AuthTokenGuard } from '../auth/guard/auth.token.guard';
import { ExecutionContext } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { TokenPayloadDto } from '../auth/dto/token.payload.dto';

describe('NotesController', () => {
  let controller: NotesController;

  const mockNotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockNotesUtils = {
    someHelperMethod: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: NotesService, useValue: mockNotesService },
        { provide: NotesUtils, useValue: mockNotesUtils },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should create a note with correct argument', async () => {
    const argument: CreateNoteDto = {
      text: 'Nota teste',
      fromId: 1,
    };

    const tokenPayload: TokenPayloadDto = {
      sub: '1',
      email: 'fabricio@email.com',
      iat: 1234567890,
      exp: 1234569999,
      aud: 'someAud',
      iss: 'someIss',
    };

    const expected = { id: 1, text: 'Nota teste', fromId: 1 };

    mockNotesService.create.mockResolvedValue(expected);

    const result = await controller.create(argument, tokenPayload);

    expect(result).toEqual(expected);
    expect(mockNotesService.create).toHaveBeenCalledWith(argument, tokenPayload);
  });
});
