import { ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions } from '@nestjs/jwt'

export const jwtConfig: JwtModuleAsyncOptions = {
    useFactory: async (configService: ConfigService) => {
        const obj = {
            secret: configService.get('APP_SECRET'),
            signOptions: {
                expiresIn: Number(configService.get<number>('APP_EXPIRES'))
            }
        }
        return obj
    },
    inject: [ConfigService]
}
