import { IsEmail, IsOptional, IsString, IsUrl, IsBoolean } from 'class-validator'

export class CreateInstructorDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    password: string

    @IsString()
    @IsUrl()
    @IsOptional()
    avatarUrl: string

    @IsBoolean()
    @IsOptional()
    status: boolean

    @IsString()
    @IsOptional()
    publicAddress: string

    constructor(partial: Partial<CreateInstructorDto>) {
        Object.assign(this, partial)
    }
}