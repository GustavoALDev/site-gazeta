import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { errorMessage } from '../constants/error-messages';

export class RegisterDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva'
  })
  @IsNotEmpty({ message: errorMessage.required })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com'
  })
  @IsNotEmpty({ message: errorMessage.required })
  @IsEmail({}, { message: errorMessage.invalidEmail })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456'
  })
  @IsNotEmpty({ message: errorMessage.required })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
} 