import { ApiProperty } from '@nestjs/swagger';

export enum PlatformType {
  ios = 'ios',
  android = 'android',
  windows = 'windows',
  mac = 'mac',
  linux = 'linux',
  web = 'web',
  other = 'other',
}

export class PlatformDto {
  @ApiProperty({
    enum: PlatformType,
    example: PlatformType.ios,
    description: 'Type of platform',
  })
  title: PlatformType;
}

export class CreateApplicationDto {
  @ApiProperty({ example: 'VS Code', description: 'Name of the application' })
  name: string;

  @ApiProperty({
    example: 'Popular code editor',
    description: 'Description of the application',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://code.visualstudio.com/sha/download',
    description: 'Direct download link for the application',
    required: false,
  })
  downloadLink?: string;

  @ApiProperty({
    example: 120.5,
    description:
      'Size of the application in MB. If not provided and downloadLink exists, will be auto-fetched.',
    required: false,
  })
  size?: number;

  @ApiProperty({
    type: PlatformDto,
    example: { title: PlatformType.ios },
    description: 'Platform information',
  })
  platform: PlatformDto;

  @ApiProperty({
    example: '60f1b2c3d4e5f6a7b8c9d0e1',
    description: 'ID of the category this app belongs to',
  })
  categoryId: string;
}
