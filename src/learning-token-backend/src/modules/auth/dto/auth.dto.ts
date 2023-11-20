import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength
} from 'class-validator'

// Login DTO
export class LoginRequestDto {
    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string

    @IsOptional()
    public type: string
}

// Registration DTO
export class RegisterRequestDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(8)
    readonly password: string

    @IsOptional()
    public type: string

    @IsString()
    @IsNotEmpty()
    publicAddress: string
}

// Validate Request DTO
export class ValidateRequestDto {
    @IsString()
    readonly token: string
}

// Registration DTO
export class RegisterInstitutionDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(8)
    readonly password: string

    @IsOptional()
    public type: string

    @IsString()
    @IsNotEmpty()
    publicAddress: string

    @IsString()
    @IsNotEmpty()
    latitude: string

    @IsString()
    @IsNotEmpty()
    longitude: string
}

export class InstitutionLoginRequestDto {
    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string

    @IsOptional()
    public type: string
}

export class RegisterLearnernDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(8)
    readonly password: string

    @IsOptional()
    public type: string

    @IsString()
    @IsNotEmpty()
    publicAddress: string

    @IsString()
    @IsNotEmpty()
    latitude: string

    @IsString()
    @IsNotEmpty()
    longitude: string
}

export class LearnerLoginRequestDto {
    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string

    @IsOptional()
    public type: string
}

export class RegisterInstructorDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(8)
    readonly password: string

    @IsOptional()
    public type: string

    @IsString()
    @IsNotEmpty()
    publicAddress: string
}

export class InstructorLoginRequestDto {
    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string

    @IsOptional()
    public type: string
}
