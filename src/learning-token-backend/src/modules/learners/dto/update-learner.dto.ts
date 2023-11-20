import { PartialType } from '@nestjs/mapped-types';
import { CreateLearnerDto } from './create-learner.dto';

export class UpdateLearnerDto extends PartialType(CreateLearnerDto) {}
