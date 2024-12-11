import { Inject, Injectable, BadRequestException } from '@nestjs/common'
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

        await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const scoringGuide = new ScoringGuide()
                const savedScoringGuide = await transactionalEntityManager.save(
                    scoringGuide
                )
                const onlineEvent = new OnlineEvent({}, savedScoringGuide)
                const savedEvent = await transactionalEntityManager.save(
                    onlineEvent
                )
                // Create Preevent
                preEventData = this.preeventRepository.create({
                    ...createPreeventDto,
                    onlineEvent: savedEvent,
                    institution: institution
                })

                await transactionalEntityManager.save(preEventData)

                const instructor = await this.instructorRepository.findOne({
                    where: {
                        email: createPreeventDto.organizerEmail
                    }
                })
                const createdAt = Math.floor(Date.now() / 1000)

                let body = {}
                if (instructor) {
                    await transactionalEntityManager.update(
                        Preevent,
                        savedEvent.id,
                        {
                            instructor: instructor
                        }
                    )
                    await transactionalEntityManager.update(
                        OnlineEvent,
                        savedEvent.id,
                        {
                            instructor: instructor
                        }
                    )
                    // body = {
                    //     role: 'instructor',
                    //     id: instructor.id,
                    //     functionName:
                    //         SmartcontractFunctionsEnum.REGISTER_INSTRUCTOR,
                    //     params: [instructor.name, createdAt]
                    // }
                    // await this.smartContractService.onboardingActor(body)
                    // body = {
                    //     role: 'institution',
                    //     id: institution.id,
                    //     functionName:
                    //         SmartcontractFunctionsEnum.ADD_INSTRUCTOR_TO_INSTITUTION,
                    //     params: [instructor.publicAddress, createdAt]
                    // }
                    // await this.smartContractService.onboardingActor(body)
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

                    let registeredInstructor =
                        await transactionalEntityManager.save(_instructor)
                    // await sendLoginCredentials(
                    //     createPreeventDto.organizerEmail,
                    //     createPreeventDto.organizerName,
                    //     '12345678',
                    //     'Dear Instructor, Please login with credentials'
                    // )

                    registeredInstructor.role = role
                    registeredInstructor.roleId = role.id
                    const wallet = await getWallet(
                        'instructor',
                        registeredInstructor.id
                    )
                    if (wallet)
                        registeredInstructor.publicAddress = wallet.address

                    registeredInstructor =
                        await transactionalEntityManager.save(
                            registeredInstructor
                        )
                    await transactionalEntityManager.update(
                        Preevent,
                        preEventData.id,
                        { instructor: registeredInstructor }
                    )
                    await transactionalEntityManager.update(
                        OnlineEvent,
                        savedEvent.id,
                        {
                            instructor: registeredInstructor
                        }
                    )
                    try {
                        body = {
                            role: 'instructor',
                            id: registeredInstructor.id,
                            functionName:
                                SmartcontractFunctionsEnum.REGISTER_INSTRUCTOR,
                            params: [registeredInstructor.name, createdAt]
                        }
                        await this.smartContractService.onboardingActor(body)
                        // Proceed only if the first call succeeds
                        await transactionalEntityManager.update(
                            Instructor,
                            registeredInstructor.id,
                            { status: true }
                        )
                        body = {
                            role: 'institution',
                            id: institution.id,
                            functionName:
                                SmartcontractFunctionsEnum.ADD_INSTRUCTOR_TO_INSTITUTION,
                            params: [
                                registeredInstructor.publicAddress,
                                createdAt
                            ]
                        }
                        await this.smartContractService.onboardingActor(body)
                    } catch (error) {
                        console.error('Error during onboarding:', error)
                        throw new BadRequestException('Error during onboarding')
                    }
                }
            }
        )

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
