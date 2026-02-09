import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Roles, RolesGuard } from '@ulongo/api-utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard) // <--- Proteção Global
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('ADMIN', 'SECRETARY', 'OPERATOR') // <--- Só estes perfis podem criar
  create(@Body() createStudentDto: CreateStudentDto, @Req() req) {
    // O tenantId vem do Middleware/JWT
    const tenantId = req.user.tenantId;
    return this.studentsService.create(tenantId, createStudentDto);
  }

  @Get()
  @Roles('ADMIN', 'SECRETARY', 'TEACHER') // Professor pode ver lista, mas não criar
  findAll(@Req() req) {
    return this.studentsService.findAll(req.user.tenantId);
  }
}
