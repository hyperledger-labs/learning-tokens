import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

export class DistributeTokenDto {
    @IsNumber()
    preEventId: number

    @IsString()
    functionName: string

    @IsOptional()
    userIds: []
}
