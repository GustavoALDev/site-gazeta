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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HomeConfigService } from './home-config.service';
import { CreateHomeCategoryConfigDto } from './dto/create-home-config.dto';
import { UpdateHomeCategoryConfigDto } from './dto/update-home-config.dto';
import { HomeCategoryConfigResponseDto } from './dto/home-config-response.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Configuração da Home')
@Controller('home-config')
export class HomeConfigController {
  constructor(private readonly homeConfigService: HomeConfigService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Adicionar categoria à configuração da home' })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 201, 
    description: 'Configuração adicionada com sucesso', 
    type: HomeCategoryConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 409, description: 'Configuração já existe para esta categoria ou ordem já está em uso' })
  async create(
    @Body() createHomeCategoryConfigDto: CreateHomeCategoryConfigDto,
    @Request() req: any,
  ): Promise<HomeCategoryConfigResponseDto> {
    return this.homeConfigService.create(createHomeCategoryConfigDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as configurações da home (incluindo inativas)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de configurações', 
    type: [HomeCategoryConfigResponseDto] 
  })
  async findAll(): Promise<HomeCategoryConfigResponseDto[]> {
    return this.homeConfigService.findAll();
  }

  @Get('visible')
  @ApiOperation({ summary: 'Listar apenas configurações visíveis na home (para uso público)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de configurações visíveis', 
    type: [HomeCategoryConfigResponseDto] 
  })
  async findVisible(): Promise<HomeCategoryConfigResponseDto[]> {
    return this.homeConfigService.findVisible();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar configuração por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada', 
    type: HomeCategoryConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HomeCategoryConfigResponseDto> {
    return this.homeConfigService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar configuração da home' })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada', 
    type: HomeCategoryConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  @ApiResponse({ status: 409, description: 'Configuração já existe para esta categoria ou ordem já está em uso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeCategoryConfigDto: UpdateHomeCategoryConfigDto,
    @Request() req: any,
  ): Promise<HomeCategoryConfigResponseDto> {
    return this.homeConfigService.update(id, updateHomeCategoryConfigDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover categoria da configuração da home' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Configuração removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(
    @Param('id', ParseIntPipe) id: number, 
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.homeConfigService.remove(id, req.user.id);
    return { message: 'Configuração removida com sucesso' };
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Alternar visibilidade da categoria na home' })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Visibilidade alterada', 
    type: HomeCategoryConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<HomeCategoryConfigResponseDto> {
    return this.homeConfigService.toggleVisibility(id, req.user.id);
  }

  @Patch('bulk-update-order')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar ordem de múltiplas categorias de uma vez',
    description: 'Permite reordenar várias categorias simultaneamente. Útil para drag-and-drop.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Ordens atualizadas com sucesso', 
    type: [HomeCategoryConfigResponseDto] 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou ordens duplicadas' })
  @ApiResponse({ status: 404, description: 'Uma ou mais configurações não encontradas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async bulkUpdateOrder(
    @Body() bulkUpdateOrderDto: BulkUpdateOrderDto,
    @Request() req: any,
  ): Promise<HomeCategoryConfigResponseDto[]> {
    return this.homeConfigService.bulkUpdateOrder(bulkUpdateOrderDto);
  }
} 