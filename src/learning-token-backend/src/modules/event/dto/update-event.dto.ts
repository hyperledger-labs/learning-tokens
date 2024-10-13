import { PartialType } from '@nestjs/mapped-types'
import { CreateEventDto } from './create-scoring-guide.dto'

export class UpdateEventDto extends PartialType(CreateEventDto) {}
