import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<{ access_token: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) return null;

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
