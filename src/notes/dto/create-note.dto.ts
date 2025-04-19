import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly text: string;

  @IsPositive()
  toId: number;

  @IsPositive()
  fromId: number;
}
