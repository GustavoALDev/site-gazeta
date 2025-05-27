import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus, ConflictException, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { errorMessage } from './constants/error-messages';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário', description: 'Endpoint para criar um novo usuário no sistema e receber token JWT' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage.serverError,
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Realizar login', description: 'Endpoint para autenticar usuário e receber token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro no servidor' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: errorMessage.inexistentUser,
          error: 'Unauthorized'
        });
      }

      return this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage.serverError,
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário', description: 'Endpoint protegido que retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getProfile(@Request() req) {
    return req.user;
  }
} 