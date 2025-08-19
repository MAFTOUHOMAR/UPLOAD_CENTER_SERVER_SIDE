import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private appService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Create a new application when you put the download link, the size will be fetched automatically.',
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully',
    schema: {
      example: {
        id: '60f1b2c3d4e5f6a7b8c9d0e2',
        name: 'VS Code',
        description: 'Popular code editor',
        categoryId: '60f1b2c3d4e5f6a7b8c9d0e1',
        downloadLink: 'https://code.visualstudio.com/sha/download.exe',
        size: 120.5,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  async create(@Body() dto: CreateApplicationDto) {
    return this.appService.create(dto);
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get all applications in a category' })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description: 'ID of the category',
    example: '60f1b2c3d4e5f6a7b8c9d0e1',
  })
  @ApiResponse({
    status: 200,
    description: 'List of applications in the category',
    schema: {
      example: [
        {
          id: '60f1b2c3d4e5f6a7b8c9d0e2',
          name: 'VS Code',
          description: 'Popular code editor',
          categoryId: '60f1b2c3d4e5f6a7b8c9d0e1',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async getAppsByCategory(@Param('categoryId') categoryId: string) {
    return this.appService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an application by ID' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async findById(@Param('id') id: string) {
    return this.appService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }
}
