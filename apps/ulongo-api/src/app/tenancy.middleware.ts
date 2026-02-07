import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenant?: any;
    }
  }
}

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction){
    const tenantSlug = req.headers['x-tenant-id'] as string;

    if (!tenantSlug) {
      return next();
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      throw new NotFoundException("Instituição não encontrada.");
    }

    if (tenant.status !== 'ACTIVE') {
      throw new NotFoundException('Instituição suspensa.');
    }

    req.tenant = tenant;
    next();
  }
}
