import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateEnrollmentDto, DocType } from './dto/create-enrollment.dto';
import { SequenceService } from './sequence.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private sequenceService: SequenceService,
  ) {}

  // async create(tenantId: string, dto: CreateStudentDto) {
  //   try {
  //     // Transação do Prisma
  //     return await this.prisma.$transaction(async (tx) => {
  //       // 1. Criar o Aluno
  //       const student = await tx.student.create({
  //         data: {
  //           name: dto.name,
  //           nationalId: dto.nationalId,
  //           tenantId: tenantId, // ISOLAMENTO DE TENANT
  //           status: 'ACTIVE',
  //           classId: dto.classId, // Opcional
  //         },
  //       });

  //       // 2. Criar e Vincular Guardiões (se existirem)
  //       if (dto.guardians && dto.guardians.length > 0) {
  //         for (const guardian of dto.guardians) {
  //           // Lógica simplificada: Criamos o PortalUser se não existir
  //           // Num sistema real, verificaríamos se o email já existe
  //           // Aqui criamos apenas o vínculo na tabela relacional para simplificar o exemplo
  //           // Assumindo que a lógica de criar User/PortalUser fica noutro serviço
  //         }
  //       }

  //       return student;
  //     });
  //   } catch (error: any) {
  //     if (error.code === 'P2002') {
  //       throw new ConflictException(
  //         'A student with this National ID already exists.',
  //       );
  //     }
  //     throw error;
  //   }
  // }
  async enrollStudent(tenantId: string, dto: CreateEnrollmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const code = await this.sequenceService.getNextStudentCode(tenantId);

      const allDocTypes = Object.values(DocType);
      const docsData = allDocTypes.map((type) => ({
        type,
        isSubmitted: dto.submittedDocuments.includes(type as DocType),
        submittedAt: dto.submittedDocuments.includes(type as DocType)
          ? new Date()
          : null,
      }));

      const student = await tx.student.create({
        data: {
          tenantId,
          name: dto.name,
          nationalId: dto.nationalId,
          email: dto.email,
          classId: dto.classId,
          status: 'ACTIVE',
          code,
          documents: {
            create: docsData,
          },
        },
      });

      if (dto.initialPayment) {
        await tx.payment.create({
          data: {
            tenantId,
            studentId: student.id,
            amount: dto.initialPayment.amount,
            method: dto.initialPayment.method,
            transactionRef: dto.initialPayment.transactionRef,
            description: dto.initialPayment.description,
          },
        });
      }

      return student;
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.student.findMany({
      where: { tenantId },
      include: { class: true }, // Traz o nome da turma
    });
  }
}
