import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  private bytesToMB(bytes: number): number {
    return Number((bytes / (1024 * 1024)).toFixed(2));
  }

  private async fetchFileSizeFromUrl(url: string): Promise<number | null> {
    try {
      const response = await axios.head(url, {
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; ApplicationService/1.0; +' +
            process.env.APP_URL +
            ')',
        },
      });

      const contentLength = response.headers['content-length'] as string;
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        if (!isNaN(sizeInBytes)) {
          return this.bytesToMB(sizeInBytes);
        }
      }

      return null;
    } catch (error) {
      console.warn(`Could not fetch size from ${url}:`, error);
      return null;
    }
  }

  async create(dto: CreateApplicationDto) {
    let size = dto.size;

    if (!size && dto.downloadLink) {
      const fetchedSize = await this.fetchFileSizeFromUrl(dto.downloadLink);
      if (fetchedSize !== null) {
        size = fetchedSize;
      }
    }

    if (!dto.name || !dto.name.trim()) {
      return {
        success: false,
        message: 'Name is required and cannot be empty',
      };
    }

    if (dto.name.length < 3) {
      return {
        success: false,
        message: 'Name must be at least 3 characters long',
      };
    }

    if (!dto.categoryId || !dto.categoryId.trim()) {
      return {
        success: false,
        message: 'Category ID is required and cannot be empty',
      };
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      return {
        success: false,
        message: 'Category with this ID does not exist',
      };
    }

    const existingApplication = await this.prisma.application.findFirst({
      where: { name: dto.name },
    });
    if (existingApplication) {
      return {
        success: false,
        message: 'Application with this name already exists',
      };
    }

    return {
      success: true,
      message: 'Application created successfully',
      data: await this.prisma.application.create({
        data: {
          name: dto.name,
          description: dto.description,
          categoryId: dto.categoryId,
          downloadLink: dto.downloadLink,
          size: size?.toString() || '0',
        },
      }),
    };
  }

  async findByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return {
        success: false,
        message: 'Category with this ID does not exist',
      };
    }

    const applications = await this.prisma.application.findMany({
      where: { categoryId },
    });

    if (applications.length === 0) {
      return {
        success: false,
        message: 'No applications found',
      };
    }

    return {
      success: true,
      message: 'Applications found successfully',
      data: applications,
    };
  }

  async findById(id: string) {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!application) {
        return {
          success: false,
          message: 'Application not found',
        };
      }

      return {
        success: true,
        message: 'Application found successfully',
        data: application,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to find application',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async delete(id: string) {
    try {
      // Check if application exists
      const application = await this.prisma.application.findUnique({
        where: { id },
      });

      if (!application) {
        return {
          success: false,
          message: 'Application not found',
        };
      }

      // Delete the application
      await this.prisma.application.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Application deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete application',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
