import { Inject, Injectable } from '@nestjs/common'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, FindOptionsOrder, Repository } from 'typeorm'
import { Preevent } from './entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { JwtService } from '../auth/service/jwt.service'
import { getWallet } from 'src/utils/kaledio'
import * as bcrypt from 'bcryptjs'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
import { OnlineEvent } from '../event/entities/event.entity'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
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
        private readonly dataSource: DataSource
    ) {}

    async create(createPreeventDto: CreatePreeventDto, secretKey) {
        const institution = await this.institutionRepository.findOne({
            where: { sdkKeys: secretKey }
        })

        if (!institution) {
            throw new Error('Institution not found')
        }

        let preevent: Preevent
        await this.dataSource.transaction(async (manager) => {
            const onlineEvent = new OnlineEvent()

            // Create Preevent
            preevent = manager.create(Preevent, {
                ...createPreeventDto,
                institution,
                onlineEvent
            })

            await manager.save(Preevent, preevent)
            const instructor = await manager.findOneBy(Instructor, {
                email: createPreeventDto.organiserEmail
            })

            if (!instructor) {
                const _instructor = new Instructor()
                _instructor.name = createPreeventDto.organiserName
                _instructor.email = createPreeventDto.organiserEmail

                const salt: string = bcrypt.genSaltSync(10)
                _instructor.password = bcrypt.hashSync('12345678', salt)

                const registeredInstructor = await manager.save(
                    Instructor,
                    _instructor
                )

                sendLoginCredentials(
                    createPreeventDto.speakerEmail,
                    createPreeventDto.speakerEmail,
                    '12345678',
                    'Dear Instructor, Please login with credentials'
                ).then((res) => {
                    console.log(res)
                })

                const _user = await manager.findOneBy(Instructor, {
                    id: registeredInstructor.id
                })

                const wallet = await getWallet(
                    'instructor',
                    registeredInstructor.id
                )
                _user.publicAddress = wallet.address

                await manager.save(Instructor, _user)
            }
        })

        return preevent
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
