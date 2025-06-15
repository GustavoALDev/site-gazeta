import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { NewsVideoService } from './news-video.service';
import { CreateNewsVideoDto } from './dto/create-news-video.dto';
import { UpdateNewsVideoDto } from './dto/update-news-video.dto';
import { NewsVideoResponseDto } from './dto/news-video-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Vídeos de Notícias')
@Controller('news-videos')
export class NewsVideoController {
  constructor(private readonly newsVideoService: NewsVideoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar novo vídeo para notícia',
    description: 'Endpoint para adicionar um novo vídeo a uma notícia específica'
  })
  @ApiResponse({
    status: 201,
    description: 'Vídeo criado com sucesso',
    type: NewsVideoResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos - Validação de campos obrigatórios'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Notícia não encontrada'
  })
  async create(@Body() createNewsVideoDto: CreateNewsVideoDto): Promise<NewsVideoResponseDto> {
    try {
      return await this.newsVideoService.create(createNewsVideoDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os vídeos',
    description: 'Endpoint para obter todos os vídeos de notícias cadastrados'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vídeos de notícias',
    type: [NewsVideoResponseDto]
  })
  async findAll(): Promise<NewsVideoResponseDto[]> {
    try {
      return await this.newsVideoService.findAll();
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('news/:newsId')
  @ApiOperation({
    summary: 'Listar vídeos por notícia',
    description: 'Endpoint para obter todos os vídeos de uma notícia específica'
  })
  @ApiParam({
    name: 'newsId',
    description: 'ID da notícia',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vídeos da notícia',
    type: [NewsVideoResponseDto]
  })
  async findByNewsId(@Param('newsId', ParseIntPipe) newsId: number): Promise<NewsVideoResponseDto[]> {
    try {
      return await this.newsVideoService.findByNewsId(newsId);
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter vídeo por ID',
    description: 'Endpoint para obter um vídeo específico pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo encontrado',
    type: NewsVideoResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<NewsVideoResponseDto> {
    try {
      return await this.newsVideoService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar vídeo',
    description: 'Endpoint para atualizar um vídeo existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo atualizado com sucesso',
    type: NewsVideoResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos - Validação de campos'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsVideoDto: UpdateNewsVideoDto
  ): Promise<NewsVideoResponseDto> {
    try {
      return await this.newsVideoService.update(id, updateNewsVideoDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar vídeo',
    description: 'Endpoint para remover um vídeo de notícia'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo deletado com sucesso'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      return await this.newsVideoService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 