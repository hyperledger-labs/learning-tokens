import { Injectable } from '@nestjs/common'
import { JwtService as Jwt } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Admin } from 'src/modules/admins/entities/user.entity'
import { Institution } from 'src/modules/institutions/entities/institution.entity'
import { Instructor } from 'src/modules/instructors/entities/instructor.entity'
import { Learner } from 'src/modules/learners/entities/learner.entity'
import { Repository } from 'typeorm'
@Injectable()
export class JwtService {
    @InjectRepository(Admin)
    private readonly userRepository: Repository<Admin>
    @InjectRepository(Learner)
    private readonly learnerRepository: Repository<Learner>
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>

    private readonly jwt: Jwt

    constructor(jwt: Jwt) {
        this.jwt = jwt
    }

    // Decoding the JWT Token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null)
    }

    // Get User by User ID we get from decode()
    public async validateUser(decoded: any) {
        let user: any
        if (decoded.type == 'Admin') {
            user = await this.userRepository.findOne({
                where: { id: decoded.id }
                // relations: [
                //     'userOrganizations.organization',
                //     'userOrganizations.role'
                // ]
            })
        } else if (decoded.type == 'Institution') {
            user = await this.institutionRepository.findOne({
                where: { id: decoded.id }
                // relations: [
                //     'userOrganizations.organization',
                //     'userOrganizations.role'
                // ]
            })
        } else if (decoded.type == 'Instructor') {
            user = await this.instructorRepository.findOne({
                where: { id: decoded.id }
                // relations: [
                //     'userOrganizations.organization',
                //     'userOrganizations.role'
                // ]
            })
        } else if (decoded.type == 'Learner') {
            user = await this.learnerRepository.findOne({
                where: { id: decoded.id }
                // relations: [
                //     'userOrganizations.organization',
                //     'userOrganizations.role'
                // ]
            })
        }

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    // Generate JWT Token
    public generateToken(auth: any, type: string): string {
        return this.jwt.sign({
            id: auth.id,
            email: auth.email,
            type: type
        })
    }

    // Validate User's password
    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword)
    }

    // Encode User's password
    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10)

        return bcrypt.hashSync(password, salt)
    }

    // Validate JWT Token, throw forbidden error if JWT Token is invalid
    public async verify(token: string): Promise<any> {
        try {
            return this.jwt.verify(token)
        } catch (err) {}
    }
}
