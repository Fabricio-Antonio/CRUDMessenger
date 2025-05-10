import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

export class CreatePersonDto {
  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minLength: 8,
      minSymbols: 1,
    },
    {
      message:
        'The password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEnum(RoutePolicies, { each: true })
  routePolicies: RoutePolicies[];
}
