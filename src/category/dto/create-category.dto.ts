import { ApiProperty } from '@nestjs/swagger';

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
}
