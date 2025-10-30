import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    // Inferir type se não vier informado
    const inferredType = this.inferType(createMenuDto);

    // Calcular order se não vier informado
    const finalOrder = await this.calculateNextOrderIfMissing(createMenuDto.order);

    // Verificar conflito de ordem
    if (finalOrder !== undefined) {
      const existingMenu = await this.prisma.menu.findUnique({
        where: { order: finalOrder }
      });
      if (existingMenu) {
        throw new ConflictException('Já existe um menu com esta ordem');
      }
    }

    // Validar campos baseado no tipo final e garantir exclusividade
    this.validateMenuByType(inferredType, {
      slug: createMenuDto.slug,
      routerLink: createMenuDto.routerLink,
      externalLink: createMenuDto.externalLink
    });

    // Limpar campos não necessários e montar payload final
    const cleanedData = this.cleanMenuDataByType({ ...createMenuDto, type: inferredType }) as CreateMenuDto;

    const menu = await this.prisma.menu.create({
      data: { ...cleanedData, order: finalOrder as number, type: inferredType },
      select: {
        id: true,
        order: true,
        name: true,
        type: true,
        slug: true,
        routerLink: true,
        externalLink: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return menu as unknown as MenuResponseDto;
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        name: true,
        type: true,
        slug: true,
        routerLink: true,
        externalLink: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return menus as unknown as MenuResponseDto[];
  }

  async findOne(id: number): Promise<MenuResponseDto> {
    const menu = await this.prisma.menu.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        order: true,
        name: true,
        type: true,
        slug: true,
        routerLink: true,
        externalLink: true,
        createdAt: true,
        updatedAt: true
      }
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

    // Combinar dados existentes com os novos e inferir/definir o tipo final
    const merged = {
      ...existingMenu,
      ...updateMenuDto
    } as UpdateMenuDto & { type?: string };

    const finalType = this.inferType(merged);

    const finalSlug = merged.slug;
    const finalRouterLink = merged.routerLink;
    const finalExternalLink = merged.externalLink;

    // Validar campos baseado no tipo final
    this.validateMenuByType(finalType, {
      slug: finalSlug,
      routerLink: finalRouterLink,
      externalLink: finalExternalLink
    });

    // Limpar campos não necessários baseado no tipo
    const cleanedData = this.cleanMenuDataByType({
      ...merged,
      type: finalType
    });

    const menu = await this.prisma.menu.update({
      where: { id },
      data: cleanedData,
      select: {
        id: true,
        order: true,
        name: true,
        type: true,
        slug: true,
        routerLink: true,
        externalLink: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return menu as unknown as MenuResponseDto;
  }

  async remove(id: number): Promise<void> {
    const menu = await this.prisma.menu.findFirst({
      where: { id, isActive: true }
    });

    if (!menu) {
      throw new NotFoundException('Menu não encontrado');
    }

    // Hard delete - remove o registro do banco de dados
    await this.prisma.menu.delete({
      where: { id }
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

  /**
   * Valida os campos baseado no tipo do menu
   */
  private validateMenuByType(type: string, data: { slug?: string; routerLink?: string; externalLink?: string }) {
    switch (type) {
      case 'category':
        if (!data.slug) {
          throw new ConflictException('Slug é obrigatório para menus do tipo category');
        }
        if (data.routerLink || data.externalLink) {
          throw new ConflictException('Menus do tipo category devem usar apenas o campo slug');
        }
        break;

      case 'internal':
        if (!data.routerLink) {
          throw new ConflictException('Router link é obrigatório para menus do tipo internal');
        }
        if (data.slug || data.externalLink) {
          throw new ConflictException('Menus do tipo internal devem usar apenas o campo routerLink');
        }
        break;

      case 'external':
        if (!data.externalLink) {
          throw new ConflictException('Link externo é obrigatório para menus do tipo external');
        }
        if (data.slug || data.routerLink) {
          throw new ConflictException('Menus do tipo external devem usar apenas o campo externalLink');
        }
        break;

      case 'submenu':
        if (data.slug || data.routerLink || data.externalLink) {
          throw new ConflictException('Menus do tipo submenu não devem possuir slug, routerLink ou externalLink');
        }
        break;

      default:
        throw new ConflictException('Tipo de menu inválido. Use: category, internal, external ou submenu');
    }
  }

  /**
   * Limpa campos não necessários baseado no tipo do menu
   */
  private cleanMenuDataByType(menuData: CreateMenuDto | (UpdateMenuDto & { type: string })): CreateMenuDto | UpdateMenuDto {
    const cleanedData = { ...menuData };

    switch (menuData.type) {
      case 'category':
        // Para categoria, manter apenas slug
        delete cleanedData.routerLink;
        delete cleanedData.externalLink;
        break;

      case 'internal':
        // Para interno, manter apenas routerLink
        delete cleanedData.slug;
        delete cleanedData.externalLink;
        break;

      case 'external':
        // Para externo, manter apenas externalLink
        delete cleanedData.slug;
        delete cleanedData.routerLink;
        break;

      case 'submenu':
        // Para submenu, nenhum link deve ser mantido
        delete cleanedData.slug;
        delete cleanedData.routerLink;
        delete cleanedData.externalLink;
        break;
    }

    return cleanedData;
  }

  /**
   * Infere o tipo a partir dos campos fornecidos quando type não é informado
   */
  private inferType(dto: CreateMenuDto | UpdateMenuDto): string {
    if (dto.type) return dto.type;
    const hasSlug = !!dto.slug;
    const hasRouterLink = !!dto.routerLink;
    const hasExternalLink = !!dto.externalLink;

    const provided = [hasSlug, hasRouterLink, hasExternalLink].filter(Boolean).length;
    if (provided === 0) return 'submenu';
    if (provided > 1) {
      throw new ConflictException('Informe exatamente um dos campos: slug, routerLink ou externalLink (ou nenhum para submenu)');
    }
    if (hasSlug) return 'category';
    if (hasRouterLink) return 'internal';
    return 'external';
  }

  /**
   * Retorna a próxima ordem (max+1) se a ordem não for fornecida
   */
  private async calculateNextOrderIfMissing(order?: number): Promise<number | undefined> {
    if (order !== undefined) return order;
    const last = await this.prisma.menu.findFirst({
      where: { isActive: true },
      orderBy: { order: 'desc' }
    });
    return (last?.order ?? 0) + 1;
  }
} 