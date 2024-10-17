import { Inject, Injectable } from '@nestjs/common'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import {
    DataSource,
    EntityManager,
    FindOptionsOrder,
    Repository
} from 'typeorm'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { JwtService } from '../auth/service/jwt.service'
import { getWallet } from 'src/utils/kaledio'
import * as bcrypt from 'bcryptjs'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
import { OnlineEvent } from '../event/entities/event.entity'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { ScoringGuide } from '../event/entities/scoring-guide.entity'
import { Role } from '../role/entities/role.entity'
import { SmartcontractService } from '../smartcontract/smartcontract.service'
import { SmartcontractFunctionsEnum } from '../smartcontract/enums/smartcontract-functions.enum'
import { Preevent } from './entities/preevent.entity'
import { CreatePreeventDto } from './dto/create-preevent.dto'
@Injectable()
export class PreeventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>,
        @InjectRepository(Instructor)
        private readonly instructorRepository: Repository<Instructor>,
        @InjectRepository(JwtService)
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
        @InjectRepository(OnlineEvent)
        private readonly onlineEventRepository: Repository<OnlineEvent>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly smartContractService: SmartcontractService
    ) {}

    async create(createPreeventDto: CreatePreeventDto, secretKey) {
        const institution = await this.institutionRepository.findOne({
            where: { sdkKeys: secretKey }
        })
        if (!institution) {
            throw new Error('Institution not found')
        }
        let preEventData = new Preevent()
        await this.entityManager.transaction(async () => {
            const scoringGuide = new ScoringGuide()
            const savedScoringGuide = await this.entityManager.save(
                scoringGuide
            )
            const onlineEvent = new OnlineEvent({}, savedScoringGuide)
            const savedEvent = await this.entityManager.save(onlineEvent)
            // Create Preevent
            preEventData = this.preeventRepository.create({
                ...createPreeventDto,
                onlineEvent: savedEvent,
                institution: institution
            })

            await this.preeventRepository.save(preEventData)
            const instructor = await this.instructorRepository.findOne({
                where: {
                    email: createPreeventDto.organizerEmail
                }
            })
            const createdAt = Math.floor(Date.now() / 1000)
            if (instructor) {
                await this.preeventRepository.update(preEventData.id, {
                    instructor: instructor
                })
                await this.onlineEventRepository.update(savedEvent.id, {
                    instructor: instructor
                })
                let body = {
                    role: 'instructor',
                    id: instructor.id,
                    functionName:
                        SmartcontractFunctionsEnum.REGISTER_INSTRUCTOR,
                    params: [instructor.name, createdAt]
                }
                await this.smartContractService.onboardingActor(body)
                body = {
                    role: 'institution',
                    id: institution.id,
                    functionName:
                        SmartcontractFunctionsEnum.ADD_INSTRUCTOR_TO_INSTITUTION,
                    params: [instructor.publicAddress, createdAt]
                }
                await this.smartContractService.onboardingActor(body)
            }
            if (!instructor) {
                const role = await this.roleRepository.findOne({
                    where: {
                        name: 'instructor'
                    }
                })
                const _instructor = new Instructor()
                _instructor.name = createPreeventDto.organizerName
                _instructor.email = createPreeventDto.organizerEmail
                _instructor.role = role
                _instructor.roleId = role.id

                const salt: string = bcrypt.genSaltSync(10)
                _instructor.password = bcrypt.hashSync('12345678', salt)

                let registeredInstructor = await this.instructorRepository.save(
                    _instructor
                )

                await sendLoginCredentials(
                    createPreeventDto.organizerEmail,
                    createPreeventDto.organizerName,
                    '12345678',
                    'Dear Instructor, Please login with credentials'
                )
                const _user = await this.instructorRepository.findOneBy({
                    id: registeredInstructor.id
                })

                _user.role = role
                _user.roleId = role.id
                const wallet = await getWallet(
                    'instructor',
                    registeredInstructor.id
                )
                if (wallet) _user.publicAddress = wallet.address

                registeredInstructor = await this.instructorRepository.save(
                    _user
                )
                await this.preeventRepository.update(preEventData.id, {
                    instructor: _user
                })
                await this.onlineEventRepository.update(savedEvent.id, {
                    instructor: _user
                })

                let body = {
                    role: 'instructor',
                    id: _instructor.id,
                    functionName:
                        SmartcontractFunctionsEnum.REGISTER_INSTRUCTOR,
                    params: [_instructor.name, createdAt]
                }
                await this.smartContractService.onboardingActor(body)
                body = {
                    role: 'institution',
                    id: institution.id,
                    functionName:
                        SmartcontractFunctionsEnum.ADD_INSTRUCTOR_TO_INSTITUTION,
                    params: [registeredInstructor.publicAddress, createdAt]
                }
                await this.smartContractService.onboardingActor(body)
            }
        })

        return preEventData
    }

    async findAllPreventDataForInstructor(
        reqUser: any,
        options: IPaginationOptions,
        search: string,
        orderBy: string,
        desc: boolean
    ) {
        const orderByQueries = ['name', 'createdAt']
        if (orderByQueries.indexOf(orderBy) === -1) {
            orderBy = 'createdAt'
        }

        const orderByCondition: FindOptionsOrder<Preevent> = {
            [orderBy]: desc ? 'DESC' : 'ASC'
        }
        console.log('reqUser::: ', reqUser);
        
        return await paginate<Preevent>(this.preeventRepository, options, {
            where: { 
                instructor: {
                    id: reqUser.id
                }
             },
            relations: [
                'onlineEvent',
                'onlineEvent.scoringGuide',
                'institution'
            ],
            order: orderByCondition
        })
    }

    findOne(id: number) {
        return `This action returns a #${id} preevent`
    }

    update(id: number, updatePreeventDto: UpdatePreeventDto) {
        return `This action updates a #${id} preevent`
    }

    remove(id: number) {
        return `This action removes a #${id} preevent`
    }
}
