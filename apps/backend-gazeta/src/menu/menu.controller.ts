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
  ApiBody,
  ApiExtraModels
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';
import { MenuExamplesDto } from './dto/menu-examples.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Menu')
@ApiExtraModels(MenuExamplesDto)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar novo menu', 
    description: `Endpoint para criar um novo item de menu. 
    
**Validações por tipo:**
- **category**: Requer apenas o campo 'slug'
- **internal**: Requer apenas o campo 'routerLink' 
- **external**: Requer apenas o campo 'externalLink'
 - **submenu**: Não deve possuir 'slug', 'routerLink' ou 'externalLink'

**Observações:**
- **type** é opcional: quando omitido, será inferido automaticamente com base em 'slug'/'routerLink'/'externalLink' (apenas um deles deve ser enviado); se nenhum for enviado, inferimos 'submenu'
- **order** é opcional: quando omitido, será atribuído automaticamente (última ordem + 1)
- Apenas o campo correspondente ao tipo será salvo
- Campos de outros tipos serão automaticamente removidos
- A ordem deve ser única no sistema` 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Menu criado com sucesso', 
    type: MenuResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos - campos obrigatórios ausentes ou formato incorreto',
    schema: {
      example: {
        statusCode: 400,
        message: 'Slug é obrigatório para menus do tipo category',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflito de dados - ordem duplicada ou campos conflitantes',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um menu com esta ordem',
        error: 'Conflict'
      }
    }
  })
  @ApiBody({
    type: CreateMenuDto,
    description: 'Dados do menu a ser criado. Você pode enviar o type explicitamente ou omitir e deixar o sistema inferir com base em slug/routerLink/externalLink (apenas um deles) ou nenhum para submenu.',
    examples: {
      category: {
        summary: 'Menu do tipo Category',
        description: 'Exemplo de menu para categoria de notícias',
        value: MenuExamplesDto.categoryExample
      },
      internal: {
        summary: 'Menu do tipo Internal',
        description: 'Exemplo de menu para link interno da aplicação',
        value: MenuExamplesDto.internalExample
      },
      external: {
        summary: 'Menu do tipo External',
        description: 'Exemplo de menu para link externo',
        value: MenuExamplesDto.externalExample
      },
      submenu: {
        summary: 'Menu do tipo Submenu',
        description: 'Exemplo de item agrupador sem link',
        value: MenuExamplesDto.submenuExample
      },
      inferCategory: {
        summary: 'Criar inferindo category (sem enviar type)',
        description: 'Exemplo criando menu enviando apenas slug',
        value: MenuExamplesDto.categoryInferExample
      },
      inferInternal: {
        summary: 'Criar inferindo internal (sem enviar type)',
        description: 'Exemplo criando menu enviando apenas routerLink',
        value: MenuExamplesDto.internalInferExample
      },
      inferExternal: {
        summary: 'Criar inferindo external (sem enviar type)',
        description: 'Exemplo criando menu enviando apenas externalLink',
        value: MenuExamplesDto.externalInferExample
      },
      inferSubmenu: {
        summary: 'Criar inferindo submenu (sem enviar type)',
        description: 'Exemplo criando menu sem enviar slug/routerLink/externalLink',
        value: MenuExamplesDto.submenuInferExample
      }
    }
  })
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
    } catch {
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
    description: `Endpoint para atualizar um menu existente.

**Validações por tipo:**
- Se o tipo for alterado, as validações do novo tipo serão aplicadas
- **category**: Requer apenas o campo 'slug'
- **internal**: Requer apenas o campo 'routerLink'
- **external**: Requer apenas o campo 'externalLink'
 - **submenu**: Não deve possuir 'slug', 'routerLink' ou 'externalLink'

**Comportamento:**
- Campos desnecessários para o tipo são automaticamente removidos
- Campos existentes são preservados se não especificados na atualização
- **type** é opcional: quando omitido, será inferido se exatamente um dos campos 'slug'/'routerLink'/'externalLink' for enviado; se nenhum for enviado, inferimos 'submenu'
- A ordem deve continuar única no sistema` 
  })
  @ApiParam({ name: 'id', description: 'ID do menu', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu atualizado com sucesso',
    type: MenuResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos - campos obrigatórios ausentes ou formato incorreto',
    schema: {
      example: {
        statusCode: 400,
        message: 'Router link é obrigatório para menus do tipo internal',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Menu não encontrado' })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflito de dados - ordem duplicada ou campos conflitantes',
    schema: {
      example: {
        statusCode: 409,
        message: 'Menus do tipo external devem usar apenas o campo externalLink',
        error: 'Conflict'
      }
    }
  })
  @ApiBody({
    type: UpdateMenuDto,
    description: 'Campos para atualizar o menu. O campo type é opcional; quando omitido, será inferido se exatamente um de slug/routerLink/externalLink for enviado.',
    examples: {
      inferCategory: {
        summary: 'Inferir category enviando apenas slug',
        value: { slug: 'tecnologia' }
      },
      inferInternal: {
        summary: 'Inferir internal enviando apenas routerLink',
        value: { routerLink: '/sobre' }
      },
      inferExternal: {
        summary: 'Inferir external enviando apenas externalLink',
        value: { externalLink: 'https://exemplo.com' }
      },
      explicitType: {
        summary: 'Alterar tipo explicitamente',
        value: { type: 'category', slug: 'politica' }
      }
    }
  })
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
    description: 'Endpoint para excluir permanentemente um menu do banco de dados' 
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