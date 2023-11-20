import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from 'src/modules/role/entities/role.entity'
import { RoleController } from 'src/modules/role/role.controller'
import { RoleService } from 'src/modules/role/role.service'

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RoleController],
    providers: [RoleService]
})
export class RoleModule {}
