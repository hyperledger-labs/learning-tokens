import { PartialType } from '@nestjs/mapped-types';
import { CreatePreeventDto } from './create-preevent.dto';

export class UpdatePreeventDto extends PartialType(CreatePreeventDto) {}
