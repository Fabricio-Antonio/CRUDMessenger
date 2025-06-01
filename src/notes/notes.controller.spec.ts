import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesUtils } from './notes.utils';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

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
    jest.clearAllMocks();

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
        email: 'fabricio@email.com',
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
        email: 'fabricio@email.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };

      mockNotesService.create.mockRejectedValueOnce(
        new Error('Creation failed'),
      );

      await expect(
        controller.create(createNoteDto, tokenPayload),
      ).rejects.toThrow('Creation failed');

      expect(mockNotesService.create).toHaveBeenCalledWith(
        createNoteDto,
        tokenPayload,
      );
    });
    it('should throw an error if note content is empty', async () => {
      const createNoteDto = plainToInstance(CreateNoteDto, {
        text: '',
        fromId: 1,
      });

      const errors = await validate(createNoteDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.minLength).toBe(
        'text must be longer than or equal to 5 characters',
      );
    });
    it('should throw an error if fromId is not provided', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note Content',
        fromId: 0,
      };

      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@email.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };

      mockNotesService.create.mockRejectedValueOnce(
        new Error('fromId must be a positive number'),
      );

      await expect(
        controller.create(createNoteDto, tokenPayload),
      ).rejects.toThrow('fromId must be a positive number');
      expect(mockNotesService.create).toHaveBeenCalledWith(
        createNoteDto,
        tokenPayload,
      );
    });
    it('should throw an error if text is more than 255 characters', async () => {
      const createNoteDto = plainToInstance(CreateNoteDto, {
        text: 'a'.repeat(256),
        fromId: 1,
      });

      const errors = await validate(createNoteDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.maxLength).toBe(
        'text must be shorter than or equal to 255 characters',
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
  describe('findOne', () => {
    it('should return a note by ID', async () => {
      const noteId = 1;
      const result = {
        id: noteId,
        text: 'Test Note Content',
        fromId: 1,
      };

      mockNotesService.findOne.mockResolvedValue(result);

      const res = await controller.findOne(noteId);

      expect(res).toEqual(result);
      expect(mockNotesService.findOne).toHaveBeenCalledWith(noteId);
    });

    it('should throw an error if note not found', async () => {
      const noteId = 999;

      mockNotesService.findOne.mockRejectedValue(new Error('Note not found'));

      await expect(controller.findOne(noteId)).rejects.toThrow(
        'Note not found',
      );

      expect(mockNotesService.findOne).toHaveBeenCalledWith(noteId);
    });
  });
  describe('update', () => {
    it('should update a note', async () => {
      const noteId = 1;
      const updateNoteDto = { text: 'Updated Note Content' };
      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@email.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };
      mockNotesService.update.mockResolvedValue({
        id: noteId,
        text: updateNoteDto.text,
        fromId: 1,
      });
      const result = await controller.update(
        noteId,
        updateNoteDto,
        tokenPayload,
      );
      expect(result).toEqual({
        id: noteId,
        text: updateNoteDto.text,
        fromId: 1,
      });
      expect(mockNotesService.update).toHaveBeenCalledWith(
        noteId,
        updateNoteDto,
        tokenPayload,
      );
    });
    it('should throw an error if note not found for update', async () => {
      const noteId = 999;
      const updateNoteDto = { text: 'Updated Note Content' };
      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@emal.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };
      mockNotesService.update.mockRejectedValue(new Error('Note not found'));
      await expect(
        controller.update(noteId, updateNoteDto, tokenPayload),
      ).rejects.toThrow('Note not found');
      expect(mockNotesService.update).toHaveBeenCalledWith(
        noteId,
        updateNoteDto,
        tokenPayload,
      );
    });
  });
  describe('delete', () => {
    it('should delete a note by ID', async () => {
      const noteId = 1;
      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@email.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };
      mockNotesService.delete.mockResolvedValue({
        id: noteId,
        text: 'Test Note Content',
        fromId: 1,
      });
      const result = await controller.removeNote(noteId, tokenPayload);
      expect(result).toEqual({
        id: noteId,
        text: 'Test Note Content',
        fromId: 1,
      });
      expect(mockNotesService.delete).toHaveBeenCalledWith(
        noteId,
        tokenPayload,
      );
    });
    it('should throw an error if note not found for deletion', async () => {
      const noteId = 999;
      const tokenPayload: TokenPayloadDto = {
        sub: '1',
        email: 'fabricio@email.com',
        iat: 1700000000,
        exp: 1700003600,
        aud: 'your-audience',
        iss: 'your-issuer',
      };
      mockNotesService.delete.mockRejectedValue(new Error('Note not found'));
      await expect(controller.removeNote(noteId, tokenPayload)).rejects.toThrow(
        'Note not found',
      );
      expect(mockNotesService.delete).toHaveBeenCalledWith(
        noteId,
        tokenPayload,
      );
    });
  });
});
