import { ConfigModule, ConfigService } from '@nestjs/config'

const smtpConfig = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<any> => {
        return {
            transport: {
                host: configService.get('SMTP_HOST'),
                auth: {
                    user: configService.get('SMTP_USER'),
                    pass: configService.get('SMTP_PASSWORD')
                }
            }
        }
    }
}

export default smtpConfig
