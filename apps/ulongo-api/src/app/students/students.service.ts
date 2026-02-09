import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateStudentDto) {
    try {
      // Transação do Prisma
      return await this.prisma.$transaction(async (tx) => {
        // 1. Criar o Aluno
        const student = await tx.student.create({
          data: {
            name: dto.name,
            nationalId: dto.nationalId,
            tenantId: tenantId, // ISOLAMENTO DE TENANT
            status: 'ACTIVE',
            classId: dto.classId, // Opcional
          },
        });

        // 2. Criar e Vincular Guardiões (se existirem)
        if (dto.guardians && dto.guardians.length > 0) {
          for (const guardian of dto.guardians) {
            // Lógica simplificada: Criamos o PortalUser se não existir
            // Num sistema real, verificaríamos se o email já existe
            // Aqui criamos apenas o vínculo na tabela relacional para simplificar o exemplo
            // Assumindo que a lógica de criar User/PortalUser fica noutro serviço
          }
        }

        return student;
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A student with this National ID already exists.');
      }
      throw error;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.student.findMany({
      where: { tenantId },
      include: { class: true }, // Traz o nome da turma
    });
  }
}
