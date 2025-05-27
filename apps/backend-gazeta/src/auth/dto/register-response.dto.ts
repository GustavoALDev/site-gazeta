import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva'
  })
  name: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-05-26T23:54:43.000Z'
  })
  createdAt: Date;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Dados do usuário criado',
    type: UserDto
  })
  user: UserDto;

  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;
} 