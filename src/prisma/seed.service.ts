import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    const username = 'admin';
    const password = 'admin123';

    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) {
      console.log('Admin user already exists');
      return;
    }

    const hashed = (await hash(password, 10)) as string;
    await this.prisma.user.create({
      data: {
        username,
        password: hashed,
        role: 'ADMIN',
      },
    });

    console.log('Seeded admin user:', username);
  }
}
