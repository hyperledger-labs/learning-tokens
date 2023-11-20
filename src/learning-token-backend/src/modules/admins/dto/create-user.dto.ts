import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Min
} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    password: string

    @IsString()
    @IsUrl()
    avatarUrl: string
}

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number

    @IsOptional()
    @IsInt()
    @Min(1)
    limit: number
}
