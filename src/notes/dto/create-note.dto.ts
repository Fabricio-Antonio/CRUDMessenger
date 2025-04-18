import { IsString, IsNotEmpty, MinLength, MaxLength, IsBoolean, IsOptional } from 'class-validator'

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    readonly text: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    readonly to: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    readonly from: string;

    @IsOptional()
    @IsBoolean()
    readonly read: boolean;
}
