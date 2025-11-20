import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDestaqueConfigDto,
  UpdateDestaqueConfigDto,
  DestaqueConfigResponseDto,
  CategoryBasicDto,
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

@Injectable()
export class ConfigSystemService {
  constructor(private prisma: PrismaService) {}

  // =============== DESTAQUE CONFIG ===============

  async createDestaqueConfig(
    dto: CreateDestaqueConfigDto,
    userId: number
  ): Promise<DestaqueConfigResponseDto> {
    // Verificar se já existe configuração para este usuário
    const existing = await this.prisma.destaqueConfig.findUnique({
      where: { createdBy: userId },
    });

    if (existing) {
      throw new ConflictException('Configuração de Destaques já existe. Use PATCH para atualizar.');
    }

    // Se não é randomMode, validar categorias
    if (!dto.randomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    // Criar configuração
    const config = await this.prisma.destaqueConfig.create({
      data: {
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

    return this.formatDestaqueResponse(config);
  }

  async getDestaqueConfig(): Promise<DestaqueConfigResponseDto | null> {
    const config = await this.prisma.destaqueConfig.findFirst({
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

    return this.formatDestaqueResponse(config);
  }

  async updateDestaqueConfig(
    dto: UpdateDestaqueConfigDto,
    userId: number
  ): Promise<DestaqueConfigResponseDto> {
    const existing = await this.prisma.destaqueConfig.findUnique({
      where: { createdBy: userId },
    });

    if (!existing) {
      throw new NotFoundException('Configuração de Destaques não encontrada. Use POST para criar.');
    }

    // Se mudou para randomMode ou mudou as categorias, validar
    const newRandomMode = dto.randomMode ?? existing.randomMode;
    if (!newRandomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    // Atualizar configuração
    const config = await this.prisma.destaqueConfig.update({
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

    return this.formatDestaqueResponse(config);
  }

  // =============== TOP GAZETA CONFIG ===============

  async createTopGazetaConfig(
    dto: CreateTopGazetaConfigDto,
    userId: number
  ): Promise<TopGazetaConfigResponseDto> {
    const existing = await this.prisma.topGazetaConfig.findUnique({
      where: { createdBy: userId },
    });

    if (existing) {
      throw new ConflictException('Configuração de Top Gazeta já existe. Use PATCH para atualizar.');
    }

    if (!dto.randomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    const config = await this.prisma.topGazetaConfig.create({
      data: {
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

    return this.formatTopGazetaResponse(config);
  }

  async getTopGazetaConfig(): Promise<TopGazetaConfigResponseDto | null> {
    const config = await this.prisma.topGazetaConfig.findFirst({
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

    return this.formatTopGazetaResponse(config);
  }

  async updateTopGazetaConfig(
    dto: UpdateTopGazetaConfigDto,
    userId: number
  ): Promise<TopGazetaConfigResponseDto> {
    const existing = await this.prisma.topGazetaConfig.findUnique({
      where: { createdBy: userId },
    });

    if (!existing) {
      throw new NotFoundException('Configuração de Top Gazeta não encontrada. Use POST para criar.');
    }

    const newRandomMode = dto.randomMode ?? existing.randomMode;
    if (!newRandomMode && dto.categoryIds) {
      await this.validateCategories(dto.categoryIds);
    }

    const config = await this.prisma.topGazetaConfig.update({
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

    return this.formatTopGazetaResponse(config);
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

  private formatDestaqueResponse(config: any): DestaqueConfigResponseDto {
    return {
      id: config.id,
      randomMode: config.randomMode,
      categories: config.categories.map((rel: any) => this.formatCategoryBasic(rel.category)),
      categoryIds: config.categories.map((rel: any) => rel.category.id),
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
    };
  }

  private formatTopGazetaResponse(config: any): TopGazetaConfigResponseDto {
    return {
      id: config.id,
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
}

