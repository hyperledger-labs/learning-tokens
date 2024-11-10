import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '../entities/role.entity'
import { User } from 'src/modules/admins/entities/user.entity'
import { UserSeed } from './user-role.seed'

@Module({
    imports: [TypeOrmModule.forFeature([Role, User])],
    providers: [UserSeed],
    exports: [UserSeed] // Optional: Export if you want to use it elsewhere
})
export class SeederModule {}
