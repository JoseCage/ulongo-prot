import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum DocType {
  IDENTITY_CARD = 'IDENTITY_CARD',
  CERTIFICATE = 'CERTIFICATE',
  PHOTOS = 'PHOTOS',
  VACCINE_CARD = 'VACCINE_CARD',
}

class InitialPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsString()
  transactionRef?: string;

  @IsString()
  description?: string;
}

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  nationalId: string;

  @IsString()
  @IsOptional()
  classId?: string;

  @IsArray()
  @IsEnum(DocType, { each: true })
  submittedDocuments: DocType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => InitialPaymentDto)
  initialPayment?: InitialPaymentDto;
}
