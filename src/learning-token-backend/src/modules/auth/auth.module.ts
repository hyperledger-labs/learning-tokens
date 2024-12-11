import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { jwtConfig } from 'src/config/jwt.config'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './service/auth.service'
import { JwtService } from './service/jwt.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { User } from '../admins/entities/user.entity'
import { Role } from '../role/entities/role.entity'
@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig),
        TypeOrmModule.forFeature([User, Institution, Learner, Instructor, Role])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy, ConfigService],
    exports: [AuthService, JwtService]
})
export class AuthModule {}
