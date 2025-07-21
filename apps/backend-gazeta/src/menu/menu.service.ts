import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    // Verificar se já existe menu com essa ordem
    const existingMenu = await this.prisma.menu.findUnique({
      where: { order: createMenuDto.order }
    });

    if (existingMenu) {
      throw new ConflictException('Já existe um menu com esta ordem');
    }

    // Validar que pelo menos um dos campos de link foi fornecido
    if (!createMenuDto.slug && !createMenuDto.routerLink && !createMenuDto.externalLink) {
      throw new ConflictException('Pelo menos um dos campos deve ser fornecido: slug, routerLink ou externalLink');
    }

    // Validar que apenas um tipo de link é fornecido baseado no tipo
    if (createMenuDto.type === 'category' && !createMenuDto.slug) {
      throw new ConflictException('Slug é obrigatório para menus do tipo category');
    }

    if (createMenuDto.type === 'internal' && !createMenuDto.routerLink) {
      throw new ConflictException('Router link é obrigatório para menus do tipo internal');
    }

    if (createMenuDto.type === 'external' && !createMenuDto.externalLink) {
      throw new ConflictException('Link externo é obrigatório para menus do tipo external');
    }

    const menu = await this.prisma.menu.create({
      data: createMenuDto
    });

    return menu;
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return menus;
  }

  async findOne(id: number): Promise<MenuResponseDto> {
    const menu = await this.prisma.menu.findFirst({
      where: { id, isActive: true }
    });

    if (!menu) {
      throw new NotFoundException('Menu não encontrado');
    }

    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<MenuResponseDto> {
    // Verificar se o menu existe
    const existingMenu = await this.prisma.menu.findFirst({
      where: { id, isActive: true }
    });

    if (!existingMenu) {
      throw new NotFoundException('Menu não encontrado');
    }

    // Verificar conflito de ordem apenas se a ordem foi fornecida
    if (updateMenuDto.order && updateMenuDto.order !== existingMenu.order) {
      const orderConflict = await this.prisma.menu.findFirst({
        where: {
          order: updateMenuDto.order,
          id: { not: id }
        }
      });

      if (orderConflict) {
        throw new ConflictException('Já existe um menu com esta ordem');
      }
    }

    // Validar baseado no tipo atualizado ou existente
    const finalType = updateMenuDto.type || existingMenu.type;
    const finalSlug = updateMenuDto.slug !== undefined ? updateMenuDto.slug : existingMenu.slug;
    const finalRouterLink = updateMenuDto.routerLink !== undefined ? updateMenuDto.routerLink : existingMenu.routerLink;
    const finalExternalLink = updateMenuDto.externalLink !== undefined ? updateMenuDto.externalLink : existingMenu.externalLink;

    if (finalType === 'category' && !finalSlug) {
      throw new ConflictException('Slug é obrigatório para menus do tipo category');
    }

    if (finalType === 'internal' && !finalRouterLink) {
      throw new ConflictException('Router link é obrigatório para menus do tipo internal');
    }

    if (finalType === 'external' && !finalExternalLink) {
      throw new ConflictException('Link externo é obrigatório para menus do tipo external');
    }

    const menu = await this.prisma.menu.update({
      where: { id },
      data: updateMenuDto
    });

    return menu;
  }

  async remove(id: number): Promise<void> {
    const menu = await this.prisma.menu.findFirst({
      where: { id, isActive: true }
    });

    if (!menu) {
      throw new NotFoundException('Menu não encontrado');
    }

    // Soft delete - apenas marca como inativo
    await this.prisma.menu.update({
      where: { id },
      data: { isActive: false }
    });
  }

  async reorder(menuOrders: { id: number; order: number }[]): Promise<MenuResponseDto[]> {
    // Verificar se todos os menus existem
    const menuIds = menuOrders.map(item => item.id);
    const existingMenus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds }, isActive: true }
    });

    if (existingMenus.length !== menuIds.length) {
      throw new NotFoundException('Um ou mais menus não foram encontrados');
    }

    // Verificar se não há ordens duplicadas
    const orders = menuOrders.map(item => item.order);
    const uniqueOrders = [...new Set(orders)];
    if (orders.length !== uniqueOrders.length) {
      throw new ConflictException('Não é possível ter ordens duplicadas');
    }

    await this.prisma.$transaction(async (prisma) => {
      for (let i = 0; i < menuOrders.length; i++) {
        await prisma.menu.update({
          where: { id: menuOrders[i].id },
          data: { order: 10000 + i }
        });
      }

      for (const { id, order } of menuOrders) {
        await prisma.menu.update({
          where: { id },
          data: { order }
        });
      }
    });

    // Retornar menus atualizados
    return await this.findAll();
  }
} 