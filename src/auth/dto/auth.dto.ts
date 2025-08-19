import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username for login',
  })
  username: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password for login',
  })
  password: string;
}
