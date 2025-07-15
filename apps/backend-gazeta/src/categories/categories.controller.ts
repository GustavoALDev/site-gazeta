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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar nova categoria', 
    description: 'Endpoint para criar uma nova categoria de notícias' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoria criada com sucesso', 
    type: CategoryResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 409, description: 'Nome ou slug já existem' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      if (error instanceof ConflictException) {
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
    summary: 'Listar categorias ativas', 
    description: 'Endpoint público para obter apenas categorias ativas' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias ativas',
    type: [CategoryResponseDto]
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Listar todas as categorias', 
    description: 'Endpoint administrativo para obter todas as categorias (ativas e inativas)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista completa de categorias (ativas e inativas)',
    type: [CategoryResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async findAllIncludingInactive(): Promise<CategoryResponseDto[]> {
    try {
      return await this.categoriesService.findAll(true);
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
    summary: 'Obter categoria por ID', 
    description: 'Endpoint para obter uma categoria específica pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria encontrada',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    try {
      return await this.categoriesService.findOne(id);
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
    summary: 'Obter categoria por slug', 
    description: 'Endpoint para obter uma categoria específica pelo slug' 
  })
  @ApiParam({ name: 'slug', description: 'Slug da categoria', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria encontrada',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    try {
      return await this.categoriesService.findBySlug(slug);
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
    summary: 'Atualizar categoria', 
    description: 'Endpoint para atualizar uma categoria existente' 
  })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria atualizada com sucesso',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 409, description: 'Nome ou slug já existem' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    try {
      return await this.categoriesService.update(id, updateCategoryDto);
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
    summary: 'Excluir categoria', 
    description: 'Endpoint para excluir uma categoria (soft delete)' 
  })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: 'number' })
  @ApiResponse({ status: 200, description: 'Categoria excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      await this.categoriesService.remove(id);
      return { message: 'Categoria excluída com sucesso' };
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