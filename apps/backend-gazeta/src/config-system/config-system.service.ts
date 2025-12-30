import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
  CategoryBasicDto,
} from './dto/top-categories-config.dto';

@Injectable()
export class ConfigSystemService {
  constructor(private prisma: PrismaService) {}

  // =============== TOP CATEGORIES CONFIG ===============

  async getTopCategoriesConfig(): Promise<TopCategoriesCombinedResponseDto> {
    const [primary, secondary] = await Promise.all([
      this.getTopCategoriesConfigByType(TopCategoryType.PRIMARY),
      this.getTopCategoriesConfigByType(TopCategoryType.SECONDARY),
    ]);

    return {
      primary,
      secondary,
    };
  }

  async createTopCategoriesConfig(
    dto: CreateTopCategoriesConfigDto,
    userId: number
  ): Promise<TopCategoriesConfigResponseDto> {
    // Verificar se já existe configuração para este tipo e usuário
    const existing = await this.prisma.topCategoriesConfig.findUnique({
      where: {
        type_createdBy: {
          type: dto.type,
          createdBy: userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Configuração de Top Categories ${dto.type} já existe. Use PATCH para atualizar.`);
    }

    // Se não é randomMode, validar categorias
    if (!dto.randomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    // Criar configuração
    const config = await this.prisma.topCategoriesConfig.create({
      data: {
        type: dto.type,
        randomMode: dto.randomMode,
        createdBy: userId,
        categories: {
          create: !dto.randomMode && dto.categoryIds
            ? dto.categoryIds.map(catId => ({ categoryId: catId }))
            : [],
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return this.formatTopCategoriesResponse(config);
  }

  async getTopCategoriesConfigByType(
    type: TopCategoryType
  ): Promise<TopCategoriesConfigResponseDto | null> {
    const config = await this.prisma.topCategoriesConfig.findFirst({
      where: { type },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!config) {
      return null;
    }

    // Se randomMode está ativo, buscar 3 categorias aleatórias
    if (config.randomMode) {
      const randomCategories = await this.getRandomCategories(3);
      return {
        id: config.id,
        type: config.type as TopCategoryType,
        randomMode: config.randomMode,
        categories: randomCategories.map(cat => this.formatCategoryBasic(cat)),
        categoryIds: randomCategories.map(cat => cat.id),
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
        createdBy: config.createdBy,
      };
    }

    return this.formatTopCategoriesResponse(config);
  }

  async updateTopCategoriesConfig(
    type: TopCategoryType,
    dto: UpdateTopCategoriesConfigDto,
    userId: number
  ): Promise<TopCategoriesConfigResponseDto> {
    const existing = await this.prisma.topCategoriesConfig.findUnique({
      where: {
        type_createdBy: {
          type,
          createdBy: userId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Configuração de Top Categories ${type} não encontrada. Use POST para criar.`);
    }

    // Se mudou para randomMode ou mudou as categorias, validar
    const newRandomMode = dto.randomMode ?? existing.randomMode;
    if (!newRandomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    // Atualizar configuração
    const config = await this.prisma.topCategoriesConfig.update({
      where: { id: existing.id },
      data: {
        randomMode: dto.randomMode ?? existing.randomMode,
        categories: dto.categoryIds ? {
          deleteMany: {},
          create: dto.categoryIds.map(catId => ({ categoryId: catId })),
        } : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return this.formatTopCategoriesResponse(config);
  }

  // =============== SECTION ORDER CONFIG ===============

  async createSectionOrder(
    dto: CreateSectionOrderDto,
    userId: number
  ): Promise<SectionOrderConfigResponseDto> {
    // Verificar se sectionId já existe
    const existing = await this.prisma.sectionOrderConfig.findUnique({
      where: { sectionId: dto.sectionId },
    });

    if (existing) {
      throw new ConflictException(`Seção '${dto.sectionId}' já existe`);
    }

    // Verificar se order já existe
    const existingOrder = await this.prisma.sectionOrderConfig.findUnique({
      where: { order: dto.order },
    });

    if (existingOrder) {
      throw new ConflictException(`Ordem ${dto.order} já está em uso`);
    }

    const section = await this.prisma.sectionOrderConfig.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });

    return this.formatSectionResponse(section);
  }

  async getSectionOrders(): Promise<SectionOrderConfigResponseDto[]> {
    const sections = await this.prisma.sectionOrderConfig.findMany({
      orderBy: { order: 'asc' },
    });

    return sections.map(s => this.formatSectionResponse(s));
  }

  async getSectionOrdersMap(): Promise<SectionOrderMapResponseDto> {
    const sections = await this.prisma.sectionOrderConfig.findMany({
      orderBy: { order: 'asc' },
    });

    const map: SectionOrderMapResponseDto = {};
    
    sections.forEach(section => {
      map[section.sectionId] = this.formatSectionResponse(section);
    });

    return map;
  }

  async getSectionOrder(sectionId: string): Promise<SectionOrderConfigResponseDto> {
    const section = await this.prisma.sectionOrderConfig.findUnique({
      where: { sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Seção '${sectionId}' não encontrada`);
    }

    return this.formatSectionResponse(section);
  }

  async updateSectionOrder(
    sectionId: string,
    dto: UpdateSectionOrderDto,
    userId: number
  ): Promise<SectionOrderConfigResponseDto> {
    const existing = await this.prisma.sectionOrderConfig.findUnique({
      where: { sectionId },
    });

    if (!existing) {
      throw new NotFoundException(`Seção '${sectionId}' não encontrada`);
    }

    // Se mudou a ordem, verificar se a nova ordem já existe
    if (dto.order !== undefined && dto.order !== existing.order) {
      const existingOrder = await this.prisma.sectionOrderConfig.findUnique({
        where: { order: dto.order },
      });

      if (existingOrder) {
        throw new ConflictException(`Ordem ${dto.order} já está em uso`);
      }
    }

    const section = await this.prisma.sectionOrderConfig.update({
      where: { sectionId },
      data: dto,
    });

    return this.formatSectionResponse(section);
  }

  async bulkUpdateSectionOrders(
    dto: BulkUpdateSectionsDto,
    userId: number
  ): Promise<SectionOrderConfigResponseDto[]> {
    // Validar que todas as seções existem
    const sectionIds = dto.sections.map(s => s.sectionId);
    const existing = await this.prisma.sectionOrderConfig.findMany({
      where: { sectionId: { in: sectionIds } },
    });

    if (existing.length !== dto.sections.length) {
      throw new NotFoundException('Uma ou mais seções não foram encontradas');
    }

    // Verificar ordens duplicadas
    const orders = dto.sections.map(s => s.order);
    const uniqueOrders = new Set(orders);
    if (uniqueOrders.size !== orders.length) {
      throw new BadRequestException('Ordens duplicadas não são permitidas');
    }

    // Atualizar todas em transação com técnica de valores temporários
    // Para evitar conflito de unique constraint na coluna 'order'
    const updated = await this.prisma.$transaction(async (tx) => {
      // Passo 1: Setar todas as orders para valores temporários (negativos)
      await Promise.all(
        dto.sections.map((section, index) =>
          tx.sectionOrderConfig.update({
            where: { sectionId: section.sectionId },
            data: { order: -(index + 1000) }, // Valores negativos temporários
          })
        )
      );

      // Passo 2: Atualizar com os valores finais
      return Promise.all(
        dto.sections.map(section =>
          tx.sectionOrderConfig.update({
            where: { sectionId: section.sectionId },
            data: {
              name: section.name,
              title: section.title,
              order: section.order,
              showTitle: section.showTitle,
              icon: section.icon,
            },
          })
        )
      );
    });

    return updated.map(s => this.formatSectionResponse(s));
  }

  async deleteSectionOrder(sectionId: string): Promise<void> {
    const section = await this.prisma.sectionOrderConfig.findUnique({
      where: { sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Seção '${sectionId}' não encontrada`);
    }

    await this.prisma.sectionOrderConfig.delete({
      where: { sectionId },
    });
  }

  // =============== SOCIAL MEDIA CONFIG ===============

  async createSocialMediaConfig(
    dto: CreateSocialMediaConfigDto,
    userId: number
  ): Promise<SocialMediaConfigResponseDto> {
    const existing = await this.prisma.socialMediaConfig.findUnique({
      where: { createdBy: userId },
    });

    if (existing) {
      throw new ConflictException('Configuração de Redes Sociais já existe. Use PATCH para atualizar.');
    }

    const config = await this.prisma.socialMediaConfig.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });

    return this.formatSocialMediaResponse(config);
  }

  async getSocialMediaConfig(): Promise<SocialMediaConfigResponseDto | null> {
    const config = await this.prisma.socialMediaConfig.findFirst();

    if (!config) {
      return null;
    }

    return this.formatSocialMediaResponse(config);
  }

  async updateSocialMediaConfig(
    dto: UpdateSocialMediaConfigDto,
    userId: number
  ): Promise<SocialMediaConfigResponseDto> {
    const existing = await this.prisma.socialMediaConfig.findUnique({
      where: { createdBy: userId },
    });

    if (!existing) {
      throw new NotFoundException('Configuração de Redes Sociais não encontrada. Use POST para criar.');
    }

    const config = await this.prisma.socialMediaConfig.update({
      where: { id: existing.id },
      data: dto,
    });

    return this.formatSocialMediaResponse(config);
  }

  // =============== MAINTENANCE CONFIG ===============

  async createMaintenanceConfig(
    dto: CreateMaintenanceConfigDto,
    userId: number
  ): Promise<MaintenanceConfigResponseDto> {
    // Verificar se já existe uma configuração global
    const existing = await this.prisma.maintenanceConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      throw new ConflictException('Configuração de Manutenção já existe. Use PATCH para atualizar.');
    }

    const config = await this.prisma.maintenanceConfig.create({
      data: {
        isActive: dto.isActive,
        createdBy: userId,
      },
    });

    return this.formatMaintenanceResponse(config);
  }

  async getMaintenanceConfig(): Promise<MaintenanceConfigResponseDto | null> {
    // Retorna a configuração mais recente (deve haver apenas uma)
    const config = await this.prisma.maintenanceConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      return null;
    }

    return this.formatMaintenanceResponse(config);
  }

  async updateMaintenanceConfig(
    dto: UpdateMaintenanceConfigDto,
    userId: number
  ): Promise<MaintenanceConfigResponseDto> {
    // Buscar a configuração global (mais recente)
    const existing = await this.prisma.maintenanceConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new NotFoundException('Configuração de Manutenção não encontrada. Use POST para criar.');
    }

    const config = await this.prisma.maintenanceConfig.update({
      where: { id: existing.id },
      data: { isActive: dto.isActive },
    });

    return this.formatMaintenanceResponse(config);
  }

  // =============== CAROUSEL CONFIG ===============

  async createCarouselConfig(
    dto: CreateCarouselConfigDto,
    userId: number
  ): Promise<CarouselConfigResponseDto> {
    // Verificar se já existe uma configuração global
    const existing = await this.prisma.carouselConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      throw new ConflictException('Configuração de Carrossel já existe. Use PATCH para atualizar.');
    }

    const config = await this.prisma.carouselConfig.create({
      data: {
        featuredNewsLimit: dto.featuredNewsLimit,
        createdBy: userId,
      },
    });

    return this.formatCarouselResponse(config);
  }

  async getCarouselConfig(): Promise<CarouselConfigResponseDto | null> {
    // Retorna a configuração mais recente (deve haver apenas uma)
    const config = await this.prisma.carouselConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      return null;
    }

    return this.formatCarouselResponse(config);
  }

  async updateCarouselConfig(
    dto: UpdateCarouselConfigDto,
    userId: number
  ): Promise<CarouselConfigResponseDto> {
    // Buscar a configuração global (mais recente)
    const existing = await this.prisma.carouselConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new NotFoundException('Configuração de Carrossel não encontrada. Use POST para criar.');
    }

    const config = await this.prisma.carouselConfig.update({
      where: { id: existing.id },
      data: { featuredNewsLimit: dto.featuredNewsLimit },
    });

    return this.formatCarouselResponse(config);
  }

  // =============== HELPER METHODS ===============

  private async validateCategories(categoryIds: number[]): Promise<void> {
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        isActive: true,
      },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('Uma ou mais categorias não foram encontradas ou estão inativas');
    }
  }

  private async getRandomCategories(count: number): Promise<any[]> {
    // Buscar todas as categorias ativas
    const allCategories = await this.prisma.category.findMany({
      where: {
        isActive: true,
      },
    });

    // Se não houver categorias suficientes, retornar todas disponíveis
    if (allCategories.length <= count) {
      return allCategories;
    }

    // Embaralhar e pegar as primeiras 'count' categorias
    const shuffled = [...allCategories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private formatTopCategoriesResponse(config: any): TopCategoriesConfigResponseDto {
    return {
      id: config.id,
      type: config.type as TopCategoryType,
      randomMode: config.randomMode,
      categories: config.categories.map((rel: any) => this.formatCategoryBasic(rel.category)),
      categoryIds: config.categories.map((rel: any) => rel.category.id),
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
    };
  }

  private formatCategoryBasic(category: any): CategoryBasicDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
    };
  }

  private formatSectionResponse(section: any): SectionOrderConfigResponseDto {
    return {
      id: section.id,
      sectionId: section.sectionId,
      name: section.name,
      title: section.title,
      order: section.order,
      showTitle: section.showTitle,
      icon: section.icon,
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
      createdBy: section.createdBy,
    };
  }

  private formatSocialMediaResponse(config: any): SocialMediaConfigResponseDto {
    return {
      id: config.id,
      instagram: config.instagram,
      facebook: config.facebook,
      youtube: config.youtube,
      linkedin: config.linkedin,
      twitter: config.twitter,
      tiktok: config.tiktok,
      whatsapp: config.whatsapp,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
    };
  }

  private formatMaintenanceResponse(config: any): MaintenanceConfigResponseDto {
    return {
      id: config.id,
      isActive: config.isActive,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
    };
  }

  private formatCarouselResponse(config: any): CarouselConfigResponseDto {
    return {
      id: config.id,
      featuredNewsLimit: config.featuredNewsLimit,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
    };
  }
}

