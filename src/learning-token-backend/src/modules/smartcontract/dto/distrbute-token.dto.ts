import { IsEnum, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

export class DistributeTokenDto {
    @IsString()
    preEventId: string

    @IsString()
    functionName: string
}
