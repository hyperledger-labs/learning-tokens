import { PartialType } from '@nestjs/mapped-types'
import { CreateSmartcontractDto } from './create-smartcontract.dto'

export class UpdateSmartcontractDto extends PartialType(
    CreateSmartcontractDto
) {}
