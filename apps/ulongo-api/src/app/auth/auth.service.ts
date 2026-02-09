import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    passwd: string,
    tenantId: string,
  ): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        tenantId,
      },
      include: {
        tenant: true,
      },
    });

    if (user && (await bcrypt.compare(passwd, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant: user.tenant?.name,
      },
    };
  }
}
