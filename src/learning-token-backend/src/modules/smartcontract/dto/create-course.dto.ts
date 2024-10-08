import { IsEnum, IsNumber, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'
import { IsNull } from 'typeorm'

export class CreateCourseDto {
    @IsString()
    courseName: string

    @IsNumber()
    preEventId: number

    @IsEnum(RoleEnum)
    userType: RoleEnum
}
