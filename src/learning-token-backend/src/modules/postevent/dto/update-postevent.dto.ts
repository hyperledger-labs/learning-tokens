import { PartialType } from '@nestjs/mapped-types';
import { CreatePosteventDto } from './create-postevent.dto';

export class UpdatePosteventDto extends PartialType(CreatePosteventDto) {}
