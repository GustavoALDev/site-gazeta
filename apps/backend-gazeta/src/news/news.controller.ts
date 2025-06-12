import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  HttpException, 
  HttpStatus,
  ConflictException,
  NotFoundException,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notícias')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar nova notícia', 
    description: 'Endpoint para criar uma nova notícia com mídias e vídeos' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Notícia criada com sucesso', 
    type: NewsResponseDto 
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
    status: 409, 
    description: 'Slug já existe - Escolha outro slug único' 
  })
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req): Promise<NewsResponseDto> {
    try {
      return await this.newsService.create(createNewsDto, req.user.id);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
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
    summary: 'Listar todas as notícias', 
    description: 'Endpoint para obter todas as notícias com suas mídias e vídeos' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de notícias com mídias e vídeos',
    type: [NewsResponseDto]
  })
  async findAll(): Promise<NewsResponseDto[]> {
    try {
      return await this.newsService.findAll();
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
    summary: 'Obter notícia por ID', 
    description: 'Endpoint para obter uma notícia específica pelo ID com suas mídias e vídeos' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da notícia', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notícia encontrada com mídias e vídeos',
    type: NewsResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Notícia não encontrada' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<NewsResponseDto> {
    try {
      return await this.newsService.findOne(id);
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

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Obter notícia por slug', 
    description: 'Endpoint para obter uma notícia específica pelo slug com suas mídias e vídeos' 
  })
  @ApiParam({ 
    name: 'slug', 
    description: 'Slug da notícia', 
    type: 'string',
    example: 'nova-tecnologia-revoluciona-mercado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notícia encontrada com mídias e vídeos',
    type: NewsResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Notícia não encontrada' 
  })
  async findBySlug(@Param('slug') slug: string): Promise<NewsResponseDto> {
    try {
      return await this.newsService.findBySlug(slug);
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
    summary: 'Atualizar notícia', 
    description: 'Endpoint para atualizar uma notícia existente com suas mídias e vídeos' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da notícia', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notícia atualizada com sucesso',
    type: NewsResponseDto
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
    description: 'Notícia não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Slug já existe - Escolha outro slug único' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateNewsDto: UpdateNewsDto
  ): Promise<NewsResponseDto> {
    try {
      return await this.newsService.update(id, updateNewsDto);
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
    summary: 'Excluir notícia', 
    description: 'Endpoint para excluir uma notícia e todas suas mídias e vídeos relacionados' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da notícia', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notícia excluída com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido ou não fornecido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Notícia não encontrada' 
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      await this.newsService.remove(id);
      return { message: 'Notícia excluída com sucesso' };
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

  @Post(':id/view')
  @ApiOperation({ 
    summary: 'Incrementar visualização', 
    description: 'Endpoint para incrementar o contador de visualizações da notícia (apenas para notícias publicadas)' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da notícia', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Visualização incrementada com sucesso',
    schema: {
      type: 'object',
      properties: {
        views: {
          type: 'number',
          example: 1251,
          description: 'Número atualizado de visualizações'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Notícia não encontrada ou não publicada' 
  })
  async incrementView(@Param('id', ParseIntPipe) id: number): Promise<{ views: number }> {
    try {
      const views = await this.newsService.incrementView(id);
      return { views };
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