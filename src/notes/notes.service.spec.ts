import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { NotesUtils } from './notes.utils';
import { EmailService } from 'src/email/email.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

const mockNote = {
  id: 1,
  text: 'Test note',
  read: false,
  date: new Date(),
  to: { id: 2, name: 'Receiver', email: 'receiver@test.com' },
  from: { id: 1, name: 'Sender', email: 'sender@test.com' },
};

describe('NotesService', () => {
  let service: NotesService;
  let noteRepository: Repository<Note>;

  const mockPeopleService = {
    findOne: jest.fn(),
  };

  const mockNotesUtils = {
    invertStrintg: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const noteRepoMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getRepositoryToken(Note), useValue: noteRepoMock },
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: NotesUtils, useValue: mockNotesUtils },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      noteRepoMock.find.mockResolvedValue([mockNote]);
      const result = await service.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual([mockNote]);
    });
  });

  describe('findOne', () => {
    it('should return a note if found', async () => {
      noteRepoMock.findOne.mockResolvedValue(mockNote);
      const result = await service.findOne(1);
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note is not found', async () => {
      noteRepoMock.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a note', async () => {
      const dto: CreateNoteDto = {
        text: 'Hello',
        fromId: 1,
      };

      const token: TokenPayloadDto = {
        sub: '2',
        email: 'receiver@test.com',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };

      mockPeopleService.findOne.mockResolvedValueOnce(mockNote.to); // to
      mockPeopleService.findOne.mockResolvedValueOnce(mockNote.from); // from

      // Create a note object with the expected text from dto
      const createdNote = { ...mockNote, text: dto.text };
      noteRepoMock.create.mockReturnValue(createdNote);
      noteRepoMock.save.mockResolvedValue(createdNote);

      const result = await service.create(dto, token);

      expect(mockPeopleService.findOne).toHaveBeenCalledTimes(2);
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(result.text).toBe(dto.text);
    });
  });

  describe('update', () => {
    it('should update and return the note if user is owner', async () => {
      const updateDto: UpdateNoteDto = { text: 'Updated text' };
      const token: TokenPayloadDto = {
        sub: '1',
        email: '',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce({ ...mockNote });

      noteRepoMock.save.mockResolvedValue({
        ...mockNote,
        text: updateDto.text,
      });

      const result = await service.update(1, updateDto, token);

      expect(result.text).toBe(updateDto.text);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const token: TokenPayloadDto = {
        sub: '999',
        email: '',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockNote);

      await expect(service.update(1, { text: 'fail' }, token)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the note if user is owner', async () => {
      const token: TokenPayloadDto = {
        sub: '1',
        email: '',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockNote);

      noteRepoMock.delete.mockResolvedValue({});

      const result = await service.delete(1, token);

      expect(noteRepoMock.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const token: TokenPayloadDto = {
        sub: '99',
        email: '',
        iat: 0,
        exp: 0,
        aud: '',
        iss: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockNote);

      await expect(service.delete(1, token)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
