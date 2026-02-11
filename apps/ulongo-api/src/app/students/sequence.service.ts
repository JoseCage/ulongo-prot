import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SequenceService {
  constructor(private prisma: PrismaService) {}

  async getNextStudentCode(tenantId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const shortYear = currentYear.toString().slice(-2);

    const seq = await this.prisma.tenantSequence.upsert({
      where: {
        tenantId_year: { tenantId, year: currentYear },
      },
      update: {
        lastValue: {
          increment: 1,
        },
      },
      create: {
        tenantId,
        year: currentYear,
        lastValue: 1,
      },
    });

    const padded = seq.lastValue.toString().padStart(4, '0');
    return `${shortYear}${padded}`;
  }
}
