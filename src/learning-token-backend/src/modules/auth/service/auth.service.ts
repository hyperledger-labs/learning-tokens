import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Institution } from 'src/modules/institutions/entities/institution.entity'
import { Instructor } from 'src/modules/instructors/entities/instructor.entity'
import { Learner } from 'src/modules/learners/entities/learner.entity'
import { Repository } from 'typeorm'
import {
    LoginRequestDto,
    RegisterRequestDto,
    ValidateRequestDto
} from '../dto/auth.dto'
import { JwtService } from './jwt.service'
import { getWallet } from 'src/utils/kaledio'
import { User } from 'src/modules/admins/entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>,
        @InjectRepository(Instructor)
        private readonly insturctorRepository: Repository<Instructor>,
        @Inject(JwtService)
        private readonly jwtService: JwtService
    ) {}

    /**
     * REGISTRATION OF A USER
     */
    public async register({
        name,
        email,
        password,
        type,
        latitude,
        longitude
    }: any) {
        console.log(type)
        if (type == 'Admin') {
            const user = new User()
            user.name = name
            user.email = email
            user.publicAddress = '0xC9ed1AF4ABd6Ea37D0e6920A44901bEAE0d297E1'
            user.password = this.jwtService.encodePassword(password)
            const registeredUser = await this.userRepository.save(user)
            return {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                token: null,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt
            }
        } else if (type == 'Institution') {
            const user = new Institution()
            user.name = name
            user.email = email
            user.password = this.jwtService.encodePassword(password)
            user.latitude = latitude
            user.longitude = longitude
            const registeredUser = await this.institutionRepository.save(user)
            const _user = await this.institutionRepository.findOneBy({
                id: registeredUser.id
            })
            const wallet = await getWallet('institution', registeredUser.id)
            _user.publicAddress = wallet.address
            this.institutionRepository.save(_user)
            return {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                token: null,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt
            }
        } else if (type == 'Learner') {
            const user = new Learner()
            user.name = name
            user.email = email
            // user.publicAddress = publicAddress
            user.password = this.jwtService.encodePassword(password)
            user.latitude = latitude
            user.longitude = longitude
            const registeredUser = await this.learnerRepository.save(user)
            return {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                token: null,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt
            }
        } else if (type == 'Instructor') {
            const user = new Instructor()
            user.name = name
            user.email = email
            // user.publicAddress = publicAddress
            user.password = this.jwtService.encodePassword(password)
            const registeredUser = await this.insturctorRepository.save(user)
            return {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                token: null,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt
            }
        }
    }

    /**
     * AUTHENTICATING A USER
     */
    public async login(loginRequestDto: LoginRequestDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginRequestDto.email },
            relations: ['role']
        })

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        const isPasswordValid: boolean = this.jwtService.isPasswordValid(
            loginRequestDto.password,
            user.password
        )

        if (!isPasswordValid) {
            // IF PASSWORD DOES NOT MATCH
            return
        }

        const token: string = this.jwtService.generateToken(
            user,
            user.role.name
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            publicAddress: user.publicAddress,
            token: token,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    /**
     * VALIDATING A USER
     */
    public async validate({ token }: ValidateRequestDto) {
        const decoded: any = await this.jwtService.verify(token)

        if (!decoded) {
            throw new ForbiddenException('Invalid Access Token')
        }

        const user = await this.jwtService.validateUser(decoded)

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    /**
     * REFRESHING TOKEN FOR AN EXISTING USER
     */
    public refreshToken(loggedInUser: any) {
        return this.jwtService.generateToken(loggedInUser, 'type')
    }
}
