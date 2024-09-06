import { IsEnum, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

export class CreateCourseDto {
    @IsString()
    courseName: string

    @IsString()
    preEventId: string

    @IsEnum(RoleEnum)
    userType: RoleEnum
}
