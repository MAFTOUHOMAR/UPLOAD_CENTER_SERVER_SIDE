import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: { example: { message: 'Invalid credentials' } },
  })
  async login(@Body() dto: SignInDto) {
    const result = await this.authService.signIn(dto);
    if (!result) {
      return { message: 'Invalid credentials' };
    }
    return result;
  }
}
