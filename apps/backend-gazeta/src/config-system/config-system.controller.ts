import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigSystemService } from './config-system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateDestaqueConfigDto,
  UpdateDestaqueConfigDto,
  DestaqueConfigResponseDto,
} from './dto/destaque-config.dto';
import {
  CreateTopGazetaConfigDto,
  UpdateTopGazetaConfigDto,
  TopGazetaConfigResponseDto,
} from './dto/top-gazeta-config.dto';
import {
  CreateSectionOrderDto,
  UpdateSectionOrderDto,
  BulkUpdateSectionsDto,
  SectionOrderConfigResponseDto,
  SectionOrderMapResponseDto,
} from './dto/section-order-config.dto';
import {
  CreateSocialMediaConfigDto,
  UpdateSocialMediaConfigDto,
  SocialMediaConfigResponseDto,
} from './dto/social-media-config.dto';

@ApiTags('Configurações do Sistema')
@Controller('config')
export class ConfigSystemController {
  constructor(private readonly configService: ConfigSystemService) {}

  // =============== DESTAQUE CONFIG ===============

  @Post('destaques')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Criar configuração de Destaques',
    description: 'Cria a configuração de categorias para a seção de Destaques. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 201, 
    description: 'Configuração criada com sucesso', 
    type: DestaqueConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createDestaqueConfig(
    @Body() dto: CreateDestaqueConfigDto,
    @Request() req: any,
  ): Promise<DestaqueConfigResponseDto> {
    return this.configService.createDestaqueConfig(dto, req.user.id);
  }

  @Get('destaques')
  @ApiOperation({ 
    summary: 'Obter configuração de Destaques',
    description: 'Retorna a configuração atual de categorias para Destaques'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada', 
    type: DestaqueConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async getDestaqueConfig(): Promise<DestaqueConfigResponseDto | null> {
    return this.configService.getDestaqueConfig();
  }

  @Patch('destaques')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar configuração de Destaques',
    description: 'Atualiza a configuração de categorias para Destaques'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada', 
    type: DestaqueConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateDestaqueConfig(
    @Body() dto: UpdateDestaqueConfigDto,
    @Request() req: any,
  ): Promise<DestaqueConfigResponseDto> {
    return this.configService.updateDestaqueConfig(dto, req.user.id);
  }

  // =============== TOP GAZETA CONFIG ===============

  @Post('top-gazeta')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Criar configuração do Top Gazeta',
    description: 'Cria a configuração de categorias para a seção Top Gazeta. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 201, 
    description: 'Configuração criada com sucesso', 
    type: TopGazetaConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createTopGazetaConfig(
    @Body() dto: CreateTopGazetaConfigDto,
    @Request() req: any,
  ): Promise<TopGazetaConfigResponseDto> {
    return this.configService.createTopGazetaConfig(dto, req.user.id);
  }

  @Get('top-gazeta')
  @ApiOperation({ 
    summary: 'Obter configuração do Top Gazeta',
    description: 'Retorna a configuração atual de categorias para Top Gazeta'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada', 
    type: TopGazetaConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async getTopGazetaConfig(): Promise<TopGazetaConfigResponseDto | null> {
    return this.configService.getTopGazetaConfig();
  }

  @Patch('top-gazeta')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar configuração do Top Gazeta',
    description: 'Atualiza a configuração de categorias para Top Gazeta'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada', 
    type: TopGazetaConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateTopGazetaConfig(
    @Body() dto: UpdateTopGazetaConfigDto,
    @Request() req: any,
  ): Promise<TopGazetaConfigResponseDto> {
    return this.configService.updateTopGazetaConfig(dto, req.user.id);
  }

  // =============== SECTION ORDER CONFIG ===============

  @Post('sections')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Criar seção',
    description: 'Cria uma nova seção na ordenação da home'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 201, 
    description: 'Seção criada com sucesso', 
    type: SectionOrderConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Seção ou ordem já existe' })
  async createSectionOrder(
    @Body() dto: CreateSectionOrderDto,
    @Request() req: any,
  ): Promise<SectionOrderConfigResponseDto> {
    return this.configService.createSectionOrder(dto, req.user.id);
  }

  @Get('sections')
  @ApiOperation({ 
    summary: 'Listar todas as seções',
    description: 'Retorna todas as seções ordenadas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de seções', 
    type: [SectionOrderConfigResponseDto] 
  })
  async getSectionOrders(): Promise<SectionOrderConfigResponseDto[]> {
    return this.configService.getSectionOrders();
  }

  @Get('sections-map')
  @ApiOperation({ 
    summary: 'Obter seções em formato de mapa',
    description: 'Retorna todas as seções em formato de objeto onde as chaves são os sectionIds. Formato ideal para uso no front-end.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Mapa de seções indexado por sectionId',
    schema: {
      type: 'object',
      additionalProperties: {
        $ref: '#/components/schemas/SectionOrderConfigResponseDto'
      },
      example: {
        carousel: {
          id: 1,
          sectionId: 'carousel',
          name: 'Carrossel',
          title: 'Últimas Notícias',
          order: 1,
          showTitle: true,
          icon: 'view_carousel',
          createdAt: '2025-11-19T14:00:00.000Z',
          updatedAt: '2025-11-19T14:00:00.000Z',
          createdBy: 1
        },
        videos: {
          id: 2,
          sectionId: 'videos',
          name: 'Vídeos',
          title: 'Vídeos em Alta',
          order: 2,
          showTitle: true,
          icon: 'play_circle',
          createdAt: '2025-11-19T14:00:00.000Z',
          updatedAt: '2025-11-19T14:00:00.000Z',
          createdBy: 1
        }
      }
    }
  })
  async getSectionOrdersMap(): Promise<SectionOrderMapResponseDto> {
    return this.configService.getSectionOrdersMap();
  }

  @Get('sections/:sectionId')
  @ApiOperation({ 
    summary: 'Obter seção específica',
    description: 'Retorna os detalhes de uma seção específica'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Seção encontrada', 
    type: SectionOrderConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  async getSectionOrder(@Param('sectionId') sectionId: string): Promise<SectionOrderConfigResponseDto> {
    return this.configService.getSectionOrder(sectionId);
  }

  @Patch('sections/:sectionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar seção',
    description: 'Atualiza os dados de uma seção específica'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Seção atualizada', 
    type: SectionOrderConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  @ApiResponse({ status: 409, description: 'Ordem já está em uso' })
  async updateSectionOrder(
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionOrderDto,
    @Request() req: any,
  ): Promise<SectionOrderConfigResponseDto> {
    return this.configService.updateSectionOrder(sectionId, dto, req.user.id);
  }

  @Patch('sections')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar múltiplas seções (bulk)',
    description: 'Atualiza todas as seções de uma vez. Útil para reordenação.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Seções atualizadas', 
    type: [SectionOrderConfigResponseDto] 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou ordens duplicadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Uma ou mais seções não encontradas' })
  async bulkUpdateSectionOrders(
    @Body() dto: BulkUpdateSectionsDto,
    @Request() req: any,
  ): Promise<SectionOrderConfigResponseDto[]> {
    return this.configService.bulkUpdateSectionOrders(dto, req.user.id);
  }

  @Delete('sections/:sectionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Deletar seção',
    description: 'Remove uma seção da ordenação'
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Seção removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  async deleteSectionOrder(
    @Param('sectionId') sectionId: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.configService.deleteSectionOrder(sectionId);
    return { message: 'Seção removida com sucesso' };
  }

  // =============== SOCIAL MEDIA CONFIG ===============

  @Post('social-media')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Criar configuração de Redes Sociais',
    description: 'Cria a configuração de links das redes sociais. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 201, 
    description: 'Configuração criada com sucesso', 
    type: SocialMediaConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createSocialMediaConfig(
    @Body() dto: CreateSocialMediaConfigDto,
    @Request() req: any,
  ): Promise<SocialMediaConfigResponseDto> {
    return this.configService.createSocialMediaConfig(dto, req.user.id);
  }

  @Get('social-media')
  @ApiOperation({ 
    summary: 'Obter configuração de Redes Sociais',
    description: 'Retorna a configuração atual de links das redes sociais'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração encontrada', 
    type: SocialMediaConfigResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async getSocialMediaConfig(): Promise<SocialMediaConfigResponseDto | null> {
    return this.configService.getSocialMediaConfig();
  }

  @Patch('social-media')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar configuração de Redes Sociais',
    description: 'Atualiza a configuração de links das redes sociais'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Configuração atualizada', 
    type: SocialMediaConfigResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateSocialMediaConfig(
    @Body() dto: UpdateSocialMediaConfigDto,
    @Request() req: any,
  ): Promise<SocialMediaConfigResponseDto> {
    return this.configService.updateSocialMediaConfig(dto, req.user.id);
  }
}

