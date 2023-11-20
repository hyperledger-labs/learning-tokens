import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from 'src/modules/admins/entities/user.entity'
import { AdminService } from 'src/modules/admins/users.service'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { AdminController } from './users.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin, Institution, Learner, Instructor])
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class UsersModule {}
