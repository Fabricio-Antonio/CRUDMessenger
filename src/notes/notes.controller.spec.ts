import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesUtils } from './notes.utils';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';

describe('NotesController', () => {
  let controller: NotesController;

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockNotesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockNotesUtils = {};

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note Content',
        fromId: 1,
      };

      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'tester@example.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };

      mockNotesService.create.mockResolvedValue(createNoteDto);

      const result = await controller.create(createNoteDto, tokenPayload);

      expect(result).toEqual(createNoteDto);
      expect(mockNotesService.create).toHaveBeenCalledWith(
        createNoteDto,
        tokenPayload,
      );
    });

    it('should throw an error if note creation fails', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note Content',
        fromId: 1,
      };

      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@EmailModule.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };

      mockNotesService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(
        controller.create(createNoteDto, tokenPayload),
      ).rejects.toThrow('Creation failed');

      expect(mockNotesService.create).toHaveBeenCalledWith(
        createNoteDto,
        tokenPayload,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = [
        {
          id: 1,
          text: 'Test Note Content',
          fromId: 1,
        },
      ];

      mockNotesService.findAll.mockResolvedValue(result);

      const paginationDto = {
        limit: 10,
        offset: 0,
      };

      const res = await controller.findAll(paginationDto);

      expect(res).toEqual(result);
      expect(mockNotesService.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });
});
