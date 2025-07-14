import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Verificar se já existe categoria com esse nome ou slug (apenas categorias ativas)
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        isActive: true,
        OR: [
          { name: createCategoryDto.name },
          { slug: createCategoryDto.slug }
        ]
      }
    });

    if (existingCategory) {
      if (existingCategory.name === createCategoryDto.name) {
        throw new ConflictException('Já existe uma categoria ativa com este nome');
      }
      if (existingCategory.slug === createCategoryDto.slug) {
        throw new ConflictException('Já existe uma categoria ativa com este slug');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        isActive: createCategoryDto.isActive ?? true // Default para true se não fornecido
      }
    });

    return category;
  }

  async findAll(includeInactive = false): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' }
    });

    return categories;
  }

  async findOne(id: number, includeInactive = false): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { 
        id, 
        ...(includeInactive ? {} : { isActive: true })
      }
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async findBySlug(slug: string, includeInactive = false): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { 
        slug, 
        ...(includeInactive ? {} : { isActive: true })
      }
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // Verificar se a categoria existe (incluindo inativas para permitir reativação)
    const existingCategory = await this.prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar conflitos de nome e slug apenas com categorias ativas
    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const conflictCategory = await this.prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { isActive: true }, // Apenas verificar conflitos com categorias ativas
            {
              OR: [
                updateCategoryDto.name ? { name: updateCategoryDto.name } : {},
                updateCategoryDto.slug ? { slug: updateCategoryDto.slug } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      });

      if (conflictCategory) {
        if (conflictCategory.name === updateCategoryDto.name) {
          throw new ConflictException('Já existe uma categoria ativa com este nome');
        }
        if (conflictCategory.slug === updateCategoryDto.slug) {
          throw new ConflictException('Já existe uma categoria ativa com este slug');
        }
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto
    });

    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id, isActive: true }
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Soft delete - apenas marca como inativa
    await this.prisma.category.update({
      where: { id },
      data: { isActive: false }
    });
  }
} 