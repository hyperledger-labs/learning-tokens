import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { jwtConfig } from 'src/config/jwt.config'
import { Admin } from 'src/modules/admins/entities/user.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './service/auth.service'
import { JwtService } from './service/jwt.service'
import { JwtStrategy } from './strategy/jwt.strategy'
@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig),
        TypeOrmModule.forFeature([Admin, Institution, Learner, Instructor])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy, ConfigService],
    exports: [AuthService]
})
export class AuthModule {}
