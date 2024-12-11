import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { SdkKeysService } from 'src/modules/sdk-keys/sdk-keys.service'

@Injectable()
export class SecretKeyGuard implements CanActivate {
    constructor(private readonly sdkKeysService: SdkKeysService) {}
    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest()
        const secretKey = request.headers['secretkey']

        if (!secretKey) {
            return false
        }

        const isValid = await this.sdkKeysService.validateSecretKey(secretKey)
        if (!isValid) {
            return false
        }

        return true
    }
}
