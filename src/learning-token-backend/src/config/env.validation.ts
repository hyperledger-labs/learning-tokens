import { plainToClass } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision'
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment

    @IsNumber()
    APP_PORT: number

    @IsString()
    APP_SECRET: string

    @IsNumber()
    APP_EXPIRES: number

    @IsString()
    POSTGRES_HOST: string

    @IsNumber()
    POSTGRES_PORT: number

    @IsString()
    DB_USERNAME: string

    @IsString()
    DB_PASSWORD: string

    @IsString()
    DB_NAME: string

    @IsString()
    AWS_S3_BUCKET_NAME: string

    @IsString()
    AWS_ACCESS_KEY_ID: string

    @IsString()
    AWS_SECRET_ACCESS_KEY: string

    @IsString()
    REDIS_HOST: string

    @IsNumber()
    REDIS_PORT: number

    @IsNumber()
    REDIS_TTL: number
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true
    })
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }
    return validatedConfig
}
