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
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar novo menu', 
    description: 'Endpoint para criar um novo item de menu' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Menu criado com sucesso', 
    type: MenuResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 409, description: 'Ordem já existe ou dados conflitantes' })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    try {
      return await this.menuService.create(createMenuDto);
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
    summary: 'Listar todos os menus', 
    description: 'Endpoint para obter todos os menus ativos ordenados por ordem' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de menus',
    type: [MenuResponseDto]
  })
  async findAll(): Promise<MenuResponseDto[]> {
    try {
      return await this.menuService.findAll();
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
    summary: 'Obter menu por ID', 
    description: 'Endpoint para obter um menu específico pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'ID do menu', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu encontrado',
    type: MenuResponseDto
  })
  @ApiResponse({ status: 404, description: 'Menu não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MenuResponseDto> {
    try {
      return await this.menuService.findOne(id);
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
    summary: 'Atualizar menu', 
    description: 'Endpoint para atualizar um menu existente' 
  })
  @ApiParam({ name: 'id', description: 'ID do menu', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu atualizado com sucesso',
    type: MenuResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Menu não encontrado' })
  @ApiResponse({ status: 409, description: 'Ordem já existe ou dados conflitantes' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMenuDto: UpdateMenuDto
  ): Promise<MenuResponseDto> {
    try {
      return await this.menuService.update(id, updateMenuDto);
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
    summary: 'Excluir menu', 
    description: 'Endpoint para excluir um menu (soft delete)' 
  })
  @ApiParam({ name: 'id', description: 'ID do menu', type: 'number' })
  @ApiResponse({ status: 200, description: 'Menu excluído com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Menu não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      await this.menuService.remove(id);
      return { message: 'Menu excluído com sucesso' };
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

  @Patch('reorder/batch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Reordenar menus', 
    description: 'Endpoint para reordenar múltiplos menus de uma vez' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Menus reordenados com sucesso',
    type: [MenuResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Um ou mais menus não foram encontrados' })
  @ApiResponse({ status: 409, description: 'Ordens duplicadas' })
  async reorder(@Body() reorderMenuDto: ReorderMenuDto): Promise<MenuResponseDto[]> {
    try {
      return await this.menuService.reorder(reorderMenuDto.menus);
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
} 