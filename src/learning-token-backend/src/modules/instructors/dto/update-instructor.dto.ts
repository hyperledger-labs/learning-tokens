import { PartialType } from '@nestjs/mapped-types';
import { CreateInstructorDto } from './create-instructor.dto';

export class UpdateInstructorDto extends PartialType(CreateInstructorDto) {}
