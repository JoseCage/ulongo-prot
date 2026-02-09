import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuardianDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  relationship: string; // PAI, MÃE, TIO
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional() // Opcional no início, obrigatório depois
  nationalId?: string; // BI

  @IsString()
  @IsOptional()
  classId?: string; // Se já for enturmar na criação

  // Dados do Encarregado (Array, pois pode ter Pai e Mãe)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GuardianDto)
  guardians?: GuardianDto[];
}
