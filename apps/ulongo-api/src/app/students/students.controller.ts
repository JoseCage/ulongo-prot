import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Roles, RolesGuard } from '@ulongo/api-utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard) // <--- Proteção Global
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('enroll')
  @Roles('ADMIN', 'SECRETARY', 'OPERATOR')
  async create(@Body() enrollment: CreateEnrollmentDto, @Req() req) {
    const tenantId = req.user.tenantId;

    const result = await this.studentsService.enrollStudent(
      tenantId,
      enrollment,
    );
    return {
      message: 'Matricula realizada com sucesso',
      studentCode: result.code,
      studentId: result.id,
    };
  }

  @Get()
  @Roles('ADMIN', 'SECRETARY', 'TEACHER')
  findAll(@Req() req) {
    return this.studentsService.findAll(req.user.tenantId);
  }
}
