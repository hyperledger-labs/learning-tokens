import { Controller } from '@nestjs/common'
import { RoleService } from 'src/modules/role/role.service'

@Controller()
export class RoleController {
    constructor(private readonly roleService: RoleService) {}
}
