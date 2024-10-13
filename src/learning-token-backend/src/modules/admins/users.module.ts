import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminService } from 'src/modules/admins/users.service'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { AdminController } from './users.controller'
import { User } from './entities/user.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Institution, Learner, Instructor])
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class UsersModule {}
