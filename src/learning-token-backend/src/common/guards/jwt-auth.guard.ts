import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { JwtService as Jwt } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly jwt: Jwt) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('No token provided')
        }

        try {
            const payload = await this.jwt.verify(token)

            request['user'] = payload
            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
