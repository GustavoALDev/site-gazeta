import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { errorMessage } from '../constants/error-messages';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'admin@example.com'
  })
  @IsNotEmpty({ message: errorMessage.required })
  @IsEmail({}, { message: errorMessage.invalidEmail })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '******'
  })
  @IsNotEmpty({ message: errorMessage.required })
  password: string;
} 