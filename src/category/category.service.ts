import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, CategoryIcon } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    if (!data.name || !data.name.trim()) {
      return {
        success: false,
        message: 'Name is required and cannot be empty',
      };
    }

    if (data.name.length < 3) {
      return {
        success: false,
        message: 'Name must be at least 3 characters long',
      };
    }

    const validIcons = Object.values(CategoryIcon);
    if (data.icon && !validIcons.includes(data.icon)) {
      return {
        success: false,
        message: 'Icon must be one of: Smartphone, Globe, Monitor, Shield, Box',
      };
    }

    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });
    if (existingCategory) {
      return {
        success: false,
        message: 'Category with this name already exists',
      };
    }

    const categoryData = {
      ...data,
      icon: data.icon || CategoryIcon.Smartphone,
    };

    return {
      success: true,
      message: 'Category created successfully',
      data: await this.prisma.category.create({ data: categoryData }),
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (categories.length === 0) {
      return {
        success: false,
        message: 'No categories found',
      };
    }

    const categoriesWithCount = categories.map((category) => ({
      ...category,
      applicationCount: category._count.applications,
      _count: undefined,
    }));

    return {
      success: true,
      message: 'Categories found successfully',
      data: categoriesWithCount,
    };
  }

  async delete(id: string) {
    try {
      // Check if category exists
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              applications: true,
            },
          },
        },
      });

      if (!category) {
        return {
          success: false,
          message: 'Category not found',
        };
      }

      // Check if category has applications
      if (category._count.applications > 0) {
        return {
          success: false,
          message: `Cannot delete category. It has ${category._count.applications} application(s). Delete applications first.`,
        };
      }

      // Delete the category
      await this.prisma.category.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
