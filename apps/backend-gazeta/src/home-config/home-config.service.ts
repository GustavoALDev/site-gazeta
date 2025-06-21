import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeCategoryConfigDto } from './dto/create-home-config.dto';
import { UpdateHomeCategoryConfigDto } from './dto/update-home-config.dto';
import { HomeCategoryConfigResponseDto } from './dto/home-config-response.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';

@Injectable()
export class HomeConfigService {
  constructor(private prisma: PrismaService) {}

  async create(
    createHomeCategoryConfigDto: CreateHomeCategoryConfigDto,
    userId: number
  ): Promise<HomeCategoryConfigResponseDto> {
    // Verificar se a categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id: createHomeCategoryConfigDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se já existe configuração para esta categoria
    const existingConfig = await this.prisma.homeCategoryConfig.findUnique({
      where: { categoryId: createHomeCategoryConfigDto.categoryId },
    });

    if (existingConfig) {
      throw new ConflictException('Configuração para esta categoria já existe');
    }

    // Verificar se a ordem já existe
    const existingOrder = await this.prisma.homeCategoryConfig.findFirst({
      where: { displayOrder: createHomeCategoryConfigDto.displayOrder },
    });

    if (existingOrder) {
      throw new ConflictException('Já existe uma categoria com esta ordem de exibição');
    }

    const config = await this.prisma.homeCategoryConfig.create({
      data: {
        categoryId: createHomeCategoryConfigDto.categoryId,
        displayOrder: createHomeCategoryConfigDto.displayOrder,
        isVisible: createHomeCategoryConfigDto.isVisible ?? true,
        maxNews: createHomeCategoryConfigDto.maxNews ?? 6,
        showTitle: createHomeCategoryConfigDto.showTitle ?? true,
        customTitle: createHomeCategoryConfigDto.customTitle,
        createdBy: userId,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.formatResponse(config);
  }

  async findAll(): Promise<HomeCategoryConfigResponseDto[]> {
    const configs = await this.prisma.homeCategoryConfig.findMany({
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return configs.map(config => this.formatResponse(config));
  }

  async findVisible(): Promise<HomeCategoryConfigResponseDto[]> {
    const configs = await this.prisma.homeCategoryConfig.findMany({
      where: {
        isVisible: true,
        category: {
          isActive: true,
        },
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return configs.map(config => this.formatResponse(config));
  }

  async findOne(id: number): Promise<HomeCategoryConfigResponseDto> {
    const config = await this.prisma.homeCategoryConfig.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!config) {
      throw new NotFoundException('Configuração não encontrada');
    }

    return this.formatResponse(config);
  }

  async update(
    id: number,
    updateHomeCategoryConfigDto: UpdateHomeCategoryConfigDto,
    userId?: number
  ): Promise<HomeCategoryConfigResponseDto> {
    const existingConfig = await this.prisma.homeCategoryConfig.findUnique({
      where: { id },
    });

    if (!existingConfig) {
      throw new NotFoundException('Configuração não encontrada');
    }

    // Se mudou a ordem, verificar se a nova ordem já existe
    if (updateHomeCategoryConfigDto.displayOrder && 
        updateHomeCategoryConfigDto.displayOrder !== existingConfig.displayOrder) {
      const existingOrder = await this.prisma.homeCategoryConfig.findFirst({
        where: { 
          displayOrder: updateHomeCategoryConfigDto.displayOrder,
          id: { not: id }
        },
      });

      if (existingOrder) {
        throw new ConflictException('Já existe uma categoria com esta ordem de exibição');
      }
    }

    // Se mudou a categoria, verificar se já existe configuração para ela
    if (updateHomeCategoryConfigDto.categoryId && 
        updateHomeCategoryConfigDto.categoryId !== existingConfig.categoryId) {
      const existingCategoryConfig = await this.prisma.homeCategoryConfig.findUnique({
        where: { categoryId: updateHomeCategoryConfigDto.categoryId },
      });

      if (existingCategoryConfig) {
        throw new ConflictException('Configuração para esta categoria já existe');
      }

      // Verificar se a nova categoria existe
      const category = await this.prisma.category.findUnique({
        where: { id: updateHomeCategoryConfigDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    const config = await this.prisma.homeCategoryConfig.update({
      where: { id },
      data: updateHomeCategoryConfigDto,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.formatResponse(config);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const config = await this.prisma.homeCategoryConfig.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException('Configuração não encontrada');
    }

    await this.prisma.homeCategoryConfig.delete({
      where: { id },
    });
  }

  async toggleVisibility(id: number, userId?: number): Promise<HomeCategoryConfigResponseDto> {
    const config = await this.prisma.homeCategoryConfig.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException('Configuração não encontrada');
    }

    const updatedConfig = await this.prisma.homeCategoryConfig.update({
      where: { id },
      data: {
        isVisible: !config.isVisible,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.formatResponse(updatedConfig);
  }

  async bulkUpdateOrder(bulkUpdateOrderDto: BulkUpdateOrderDto): Promise<HomeCategoryConfigResponseDto[]> {
    const { configs } = bulkUpdateOrderDto;

    // Verificar se todas as configurações existem
    const configIds = configs.map(c => c.id);
    const existingConfigs = await this.prisma.homeCategoryConfig.findMany({
      where: { id: { in: configIds } },
    });

    if (existingConfigs.length !== configs.length) {
      throw new NotFoundException('Uma ou mais configurações não foram encontradas');
    }

    // Verificar se há ordens duplicadas
    const orders = configs.map(c => c.displayOrder);
    const uniqueOrders = new Set(orders);
    if (uniqueOrders.size !== orders.length) {
      throw new BadRequestException('Ordens duplicadas não são permitidas');
    }

    // Atualizar as ordens em uma transação
    const updatedConfigs = await this.prisma.$transaction(
      configs.map(config => 
        this.prisma.homeCategoryConfig.update({
          where: { id: config.id },
          data: { displayOrder: config.displayOrder },
          include: {
            category: true,
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
      )
    );

    return updatedConfigs.map(config => this.formatResponse(config));
  }

  async reorderAfterDelete(deletedOrder: number): Promise<void> {
    // Reordenar as configurações após exclusão
    await this.prisma.homeCategoryConfig.updateMany({
      where: {
        displayOrder: { gt: deletedOrder }
      },
      data: {
        displayOrder: { decrement: 1 }
      }
    });
  }

  private formatResponse(config: any): HomeCategoryConfigResponseDto {
    return {
      id: config.id,
      categoryId: config.categoryId,
      displayOrder: config.displayOrder,
      isVisible: config.isVisible,
      maxNews: config.maxNews,
      showTitle: config.showTitle,
      customTitle: config.customTitle,
      createdAt: config.createdAt.toISOString(),
      updatedAt: config.updatedAt.toISOString(),
      createdBy: config.createdBy,
      creatorName: config.creator?.name || 'Usuário não encontrado',
      category: {
        id: config.category.id,
        name: config.category.name,
        slug: config.category.slug,
        description: config.category.description,
        isActive: config.category.isActive,
      },
    };
  }
} 