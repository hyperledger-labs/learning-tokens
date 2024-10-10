import { Inject, Injectable } from '@nestjs/common'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import {
    DataSource,
    EntityManager,
    FindOptionsOrder,
    Repository
} from 'typeorm'
import { Preevent } from './entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { JwtService } from '../auth/service/jwt.service'
import { getWallet } from 'src/utils/kaledio'
import * as bcrypt from 'bcryptjs'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
import { OnlineEvent } from '../event/entities/event.entity'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { ScoringGuide } from '../event/entities/scoring-guide.entity'
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
        @InjectEntityManager()
        private readonly entityManager: EntityManager
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
            const instructor = await this.instructorRepository.findOneBy({
                email: createPreeventDto.organizerEmail
            })

            if (!instructor) {
                const _instructor = new Instructor()
                _instructor.name = createPreeventDto.organizerName
                _instructor.email = createPreeventDto.organizerEmail

                const salt: string = bcrypt.genSaltSync(10)
                _instructor.password = bcrypt.hashSync('12345678', salt)

                const registeredInstructor =
                    await this.instructorRepository.save(_instructor)

                await sendLoginCredentials(
                    createPreeventDto.organizerEmail,
                    createPreeventDto.organizerName,
                    '12345678',
                    'Dear Instructor, Please login with credentials'
                )
                const _user = await this.instructorRepository.findOneBy({
                    id: registeredInstructor.id
                })

                const wallet = await getWallet(
                    'instructor',
                    registeredInstructor.id
                )
                _user.publicAddress = wallet.address

                await this.instructorRepository.save(_user)
                await this.preeventRepository.update(preEventData.id, {
                    instructor: _user
                })
            }
        })

        return preEventData
    }

    async findAllPreventDataForInstructor(
        req: any,
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

        return paginate<Preevent>(this.preeventRepository, options, {
            where: { id: req.user.id },
            relations: ['onlineEvent', 'onlineEvent.scoringGuide'],
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
