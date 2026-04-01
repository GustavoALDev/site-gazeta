import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
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
import {
  CreateMaintenanceConfigDto,
  UpdateMaintenanceConfigDto,
  MaintenanceConfigResponseDto,
} from './dto/maintenance-config.dto';
import {
  CreateCarouselConfigDto,
  UpdateCarouselConfigDto,
  CarouselConfigResponseDto,
} from './dto/carousel-config.dto';
import {
  CreateTopCategoriesConfigDto,
  UpdateTopCategoriesConfigDto,
  TopCategoriesConfigResponseDto,
  TopCategoriesCombinedResponseDto,
  TopCategoryType,
} from './dto/top-categories-config.dto';

@ApiTags('Configurações do Sistema')
@Controller('config')
export class ConfigSystemController {
  constructor(private readonly configService: ConfigSystemService) {}

  // =============== TOP CATEGORIES CONFIG ===============

  @Get('top-categories')
  @ApiOperation({
    summary: 'Obter configurações de Top Categories',
    description: 'Retorna as configurações de categorias primárias e secundárias em um único endpoint.'
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações encontradas',
    type: TopCategoriesCombinedResponseDto
  })
  async getTopCategoriesConfig(): Promise<TopCategoriesCombinedResponseDto> {
    return this.configService.getTopCategoriesConfig();
  }

  @Post('top-categories-primary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar configuração de Top Categories Primary',
    description: 'Cria a configuração de categorias primárias. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
    type: TopCategoriesConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createTopCategoriesPrimary(
    @Body() dto: Omit<CreateTopCategoriesConfigDto, 'type'>,
    @Request() req: any,
  ): Promise<TopCategoriesConfigResponseDto> {
    return this.configService.createTopCategoriesConfig(
      { ...dto, type: TopCategoryType.PRIMARY },
      req.user.id
    );
  }

  @Patch('top-categories-primary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar configuração de Top Categories Primary',
    description: 'Atualiza a configuração de categorias primárias'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada',
    type: TopCategoriesConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateTopCategoriesPrimary(
    @Body() dto: UpdateTopCategoriesConfigDto,
    @Request() req: any,
  ): Promise<TopCategoriesConfigResponseDto> {
    return this.configService.updateTopCategoriesConfig(TopCategoryType.PRIMARY, dto, req.user.id);
  }

  @Post('top-categories-secondary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar configuração de Top Categories Secondary',
    description: 'Cria a configuração de categorias secundárias. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
    type: TopCategoriesConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createTopCategoriesSecondary(
    @Body() dto: Omit<CreateTopCategoriesConfigDto, 'type'>,
    @Request() req: any,
  ): Promise<TopCategoriesConfigResponseDto> {
    return this.configService.createTopCategoriesConfig(
      { ...dto, type: TopCategoryType.SECONDARY },
      req.user.id
    );
  }

  @Patch('top-categories-secondary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar configuração de Top Categories Secondary',
    description: 'Atualiza a configuração de categorias secundárias'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada',
    type: TopCategoriesConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateTopCategoriesSecondary(
    @Body() dto: UpdateTopCategoriesConfigDto,
    @Request() req: any,
  ): Promise<TopCategoriesConfigResponseDto> {
    return this.configService.updateTopCategoriesConfig(TopCategoryType.SECONDARY, dto, req.user.id);
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

  @Put('social-media')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar ou atualizar configuração de Redes Sociais (Upsert)',
    description: 'Cria a configuração de links das redes sociais se não existir, ou atualiza se já existir. Só pode existir uma por usuário.'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Configuração salva com sucesso',
    type: SocialMediaConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async upsertSocialMediaConfig(
    @Body() dto: UpdateSocialMediaConfigDto,
    @Request() req: any,
  ): Promise<SocialMediaConfigResponseDto> {
    return this.configService.upsertSocialMediaConfig(dto, req.user.id);
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

  // =============== MAINTENANCE CONFIG ===============

  @Post('maintenance')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar configuração de Manutenção',
    description: 'Cria a configuração global de manutenção do site. Só pode existir uma configuração no sistema.'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
    type: MaintenanceConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createMaintenanceConfig(
    @Body() dto: CreateMaintenanceConfigDto,
    @Request() req: any,
  ): Promise<MaintenanceConfigResponseDto> {
    return this.configService.createMaintenanceConfig(dto, req.user.id);
  }

  @Get('maintenance')
  @ApiOperation({
    summary: 'Obter configuração de Manutenção',
    description: 'Retorna a configuração atual de manutenção do site'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração encontrada',
    type: MaintenanceConfigResponseDto
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async getMaintenanceConfig(): Promise<MaintenanceConfigResponseDto | null> {
    return this.configService.getMaintenanceConfig();
  }

  @Patch('maintenance')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar configuração de Manutenção',
    description: 'Atualiza a configuração de manutenção do site'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada',
    type: MaintenanceConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateMaintenanceConfig(
    @Body() dto: UpdateMaintenanceConfigDto,
    @Request() req: any,
  ): Promise<MaintenanceConfigResponseDto> {
    return this.configService.updateMaintenanceConfig(dto, req.user.id);
  }

  // =============== CAROUSEL CONFIG ===============

  @Post('carousel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Criar configuração de Carrossel',
    description: 'Cria a configuração global do carrossel. Só pode existir uma configuração no sistema.'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
    type: CarouselConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Configuração já existe' })
  async createCarouselConfig(
    @Body() dto: CreateCarouselConfigDto,
    @Request() req: any,
  ): Promise<CarouselConfigResponseDto> {
    return this.configService.createCarouselConfig(dto, req.user.id);
  }

  @Get('carousel')
  @ApiOperation({
    summary: 'Obter configuração de Carrossel',
    description: 'Retorna a configuração atual do carrossel'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração encontrada',
    type: CarouselConfigResponseDto
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async getCarouselConfig(): Promise<CarouselConfigResponseDto | null> {
    return this.configService.getCarouselConfig();
  }

  @Patch('carousel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar configuração de Carrossel',
    description: 'Atualiza a configuração do carrossel'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada',
    type: CarouselConfigResponseDto
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  async updateCarouselConfig(
    @Body() dto: UpdateCarouselConfigDto,
    @Request() req: any,
  ): Promise<CarouselConfigResponseDto> {
    return this.configService.updateCarouselConfig(dto, req.user.id);
  }
}

