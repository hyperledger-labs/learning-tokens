import { SetMetadata } from '@nestjs/common'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

export const ALLOWED_USER_TYPES = 'allowedUserTypes'
export const AllowUserTypes = (...allowedUserTypes: RoleEnum[]) =>
    SetMetadata(ALLOWED_USER_TYPES, allowedUserTypes)
