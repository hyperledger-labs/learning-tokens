import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/common/decorators/roles.decorator'
import { UserRoleEnum } from 'src/modules/admins/enums/user.enum'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!requiredRoles) {
            return true
        }
        const request = context.switchToHttp().getRequest()

        if (request.user) {
            if (request.user.role.isAdmin) {
                return requiredRoles.indexOf(UserRoleEnum.ADMIN) > -1
                    ? true
                    : false
            }
        }

        return false
    }
}
