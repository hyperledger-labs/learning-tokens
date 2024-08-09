import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { SdkKeysService } from '../../modules/sdk-keys/sdk-keys.service'

@Injectable()
export class SDKGuard implements CanActivate {
    constructor(private readonly sdkKeysService: SdkKeysService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const sdkKey = request.headers['sdk-key']

        if (!sdkKey) {
            throw new UnauthorizedException('SDK key is missing')
        }

        const isValid = await this.sdkKeysService.validateSdkKeyForInstitution(
            sdkKey
        )
        if (!isValid) {
            throw new UnauthorizedException('Invalid SDK key')
        }

        return true
    }
}
