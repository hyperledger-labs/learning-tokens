import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    userId: number
}
