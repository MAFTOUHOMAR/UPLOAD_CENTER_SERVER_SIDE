import { ApiProperty } from '@nestjs/swagger';

export enum CategoryIcon {
  Smartphone = 'Smartphone',
  Globe = 'Globe',
  Monitor = 'Monitor',
  Shield = 'Shield',
  Box = 'Box',
}

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Productivity',
    description: 'Name of the category (must be unique)',
  })
  name: string;

  @ApiProperty({
    example: 'Tools to boost productivity',
    description: 'Optional description of the category',
    required: false,
  })
  description?: string;

  @ApiProperty({
    enum: CategoryIcon,
    example: CategoryIcon.Smartphone,
    description: 'Icon for the category (defaults to Smartphone)',
    required: false,
    default: CategoryIcon.Smartphone,
  })
  icon?: CategoryIcon;
}
