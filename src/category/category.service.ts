import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string }) {
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

    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });
    if (existingCategory) {
      return {
        success: false,
        message: 'Category with this name already exists',
      };
    }

    return {
      success: true,
      message: 'Category created successfully',
      data: await this.prisma.category.create({ data }),
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();

    if (categories.length === 0) {
      return {
        success: false,
        message: 'No categories found',
      };
    }

    return {
      success: true,
      message: 'Categories found successfully',
      data: categories,
    };
  }
}
