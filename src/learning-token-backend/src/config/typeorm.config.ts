import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions
} from '@nestjs/typeorm'

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: configService.get('POSTGRES_HOST', 'localhost'),
            port: configService.get<number>('POSTGRES_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'password'),
            database: configService.get('DB_NAME', 'nestjs-starter-kit'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            extra: {
                charset: 'utf8mb4_unicode_ci'
            },
            synchronize: true,
            logging: false
        }
    }
}
