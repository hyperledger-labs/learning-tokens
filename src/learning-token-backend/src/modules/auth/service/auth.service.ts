import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Admin } from 'src/modules/admins/entities/user.entity'
import { Institution } from 'src/modules/institutions/entities/institution.entity'
import { Instructor } from 'src/modules/instructors/entities/instructor.entity'
import { Learner } from 'src/modules/learners/entities/learner.entity'
import { Repository } from 'typeorm'
import { RegisterRequestDto, ValidateRequestDto } from '../dto/auth.dto'
import { JwtService } from './jwt.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Admin)
        private readonly userRepository: Repository<Admin>,
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
        publicAddress,
        type,
        latitude,
        longitude
    }: any) {
        console.log(type)
        if (type == 'Admin') {
            const user = new Admin()
            user.name = name
            user.email = email
            user.publicAddress = publicAddress
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
            user.publicAddress = publicAddress
            user.password = this.jwtService.encodePassword(password)
            user.latitude = latitude
            user.longitude = longitude
            const registeredUser = await this.institutionRepository.save(user)
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
            user.publicAddress = publicAddress
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
            user.publicAddress = publicAddress
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
    public async login({ email, password, type }) {
        console.log('type', type)
        if (type == 'Admin') {
            const user: Admin = await this.userRepository.findOne({
                where: { email }
            })

            if (!user) {
                // IF USER NOT FOUND
                return
            }

            const isPasswordValid: boolean = this.jwtService.isPasswordValid(
                password,
                user.password
            )

            if (!isPasswordValid) {
                // IF PASSWORD DOES NOT MATCH
                return
            }

            const token: string = this.jwtService.generateToken(user, 'Admin')

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                publicAddress: user.publicAddress,
                token: token,
                type: 'admin',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        } else if (type == 'Institution') {
            const user: Institution = await this.institutionRepository.findOne({
                where: { email }
            })

            if (!user) {
                // IF USER NOT FOUND
                return
            }

            const isPasswordValid: boolean = this.jwtService.isPasswordValid(
                password,
                user.password
            )

            if (!isPasswordValid) {
                // IF PASSWORD DOES NOT MATCH
                return
            }

            const token: string = this.jwtService.generateToken(
                user,
                'Institution'
            )

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                publicAddress: user.publicAddress,
                token: token,
                type: 'institution',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        } else if (type == 'Learner') {
            const user: Learner = await this.learnerRepository.findOne({
                where: { email }
            })

            if (!user) {
                // IF USER NOT FOUND
                return
            }

            const isPasswordValid: boolean = this.jwtService.isPasswordValid(
                password,
                user.password
            )

            if (!isPasswordValid) {
                // IF PASSWORD DOES NOT MATCH
                return
            }

            const token: string = this.jwtService.generateToken(user, 'Learner')

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                publicAddress: user.publicAddress,
                token: token,
                type: 'learner',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        } else if (type == 'Instructor') {
            const user: Instructor = await this.insturctorRepository.findOne({
                where: { email }
            })

            if (!user) {
                // IF USER NOT FOUND
                return
            }

            const isPasswordValid: boolean = this.jwtService.isPasswordValid(
                password,
                user.password
            )

            if (!isPasswordValid) {
                // IF PASSWORD DOES NOT MATCH
                return
            }

            const token: string = this.jwtService.generateToken(
                user,
                'Instructor'
            )
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                publicAddress: user.publicAddress,
                token: token,
                type: 'instructor',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
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
