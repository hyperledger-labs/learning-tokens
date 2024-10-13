import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtService } from '../service/jwt.service'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    @Inject(JwtService)
    private readonly jwtService: JwtService

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.APP_SECRET,
            ignoreExpiration: true
        })
    }

    private validate(token: string) {
        return this.jwtService.validateUser(token)
    }
}
