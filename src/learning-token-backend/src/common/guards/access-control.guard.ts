import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AllowUserTypes } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'

@Injectable()
export class AccessControlGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const allowedUserTypes = this.reflector.get<string>(
            'allowedUserTypes',
            context.getHandler()
        )
        const request = context.switchToHttp().getRequest()

        console.log('request', request.user)
        if (request.user?.role) {
            // if (request.user.role.isAdmin) {
            //     return requiredRoles.indexOf(RoleEnum.ADMIN) > -1 ? true : false
            // }

            return allowedUserTypes.indexOf(request.user['role'].name) > -1
                ? true
                : false
        }

        return false
    }
}
