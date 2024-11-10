import { IsEnum, IsNumber, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

export class CreateCourseDto {
    @IsString()
    courseName: string

    @IsNumber()
    preEventId: number
}
