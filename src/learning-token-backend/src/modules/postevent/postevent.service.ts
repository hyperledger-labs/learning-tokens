import { Injectable } from '@nestjs/common'
import { CreatePosteventDto } from './dto/create-postevent.dto'
import { UpdatePosteventDto } from './dto/update-postevent.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Preevent, PreEventEnum } from '../preevent/entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Postevent } from './entities/postevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import * as bcrypt from 'bcryptjs'
import { getWallet } from 'src/utils/kaledio'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
import { Role } from '../role/entities/role.entity'
import { SmartcontractService } from '../smartcontract/smartcontract.service'
import { SmartcontractFunctionsEnum } from '../smartcontract/enums/smartcontract-functions.enum'
@Injectable()
export class PosteventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Postevent)
        private readonly posteventRepository: Repository<Postevent>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private readonly smartContractService: SmartcontractService
    ) {}
    async create(createPosteventDto: CreatePosteventDto) {
        const event = await this.preeventRepository.findOne({
            where: { meetingEventId: createPosteventDto.meetingEventId }
        })
        if (!event) {
            throw new Error('Institution not found')
        }

        const role = await this.roleRepository.findOne({
            where: { name: 'learner' }
        })

        //every post event will have the same preevent

        await this.entityManager.transaction(async () => {
            // await this.posteventRepository.save(postevent)

            for (
                let index = 0;
                index < createPosteventDto.attendees.length;
                index++
            ) {
                const element = createPosteventDto.attendees[index]
                const learner = await this.learnerRepository.findOneBy({
                    email: element.email
                })
                const postevent = this.posteventRepository.create({
                    ...element,
                    preevent: event
                })
                const createdAt = Math.floor(Date.now() / 1000)

                let body = {
                    role: 'learner',
                    id: learner.id,
                    functionName: SmartcontractFunctionsEnum.REGISTER_LEARNER,
                    params: [learner.name, createdAt, '123', '321']
                }
                if (learner) {
                    await this.smartContractService.onboardingActor(body)
                }
                await this.posteventRepository.save(postevent)
                if (!learner) {
                    const _learner = new Learner()
                    _learner.name = element.name
                    _learner.role = role
                    _learner.email = element.email

                    const salt: string = bcrypt.genSaltSync(10)
                    _learner.password = bcrypt.hashSync('12345678', salt)

                    const registeredLearner = await this.learnerRepository.save(
                        _learner
                    )

                    sendLoginCredentials(
                        element.email,
                        element.email,
                        '12345678',
                        'Dear learner, Please login with credentials'
                    ).then((res) => {
                        console.log(res)
                    })

                    const _user = await this.learnerRepository.findOneBy({
                        id: registeredLearner.id
                    })

                    const wallet = await getWallet(
                        'learner',
                        registeredLearner.id
                    )
                    _user.publicAddress = wallet.address

                    await this.learnerRepository.save(_user)
                    body = {
                        role: 'learner',
                        id: registeredLearner.id,
                        functionName:
                            SmartcontractFunctionsEnum.REGISTER_LEARNER,
                        params: [
                            registeredLearner.name,
                            createdAt,
                            registeredLearner.latitude,
                            registeredLearner.longitude
                        ]
                    }
                    await this.smartContractService.onboardingActor(body)
                }
            }
        })

        await this.preeventRepository.update(event.id, {
            status: PreEventEnum.COURSECREATING
        })
        return {
            status: 201,
            message: 'Post-event created successfully'
        }
    }

    findAll() {
        return `This action returns all postevent`
    }

    findOne(id: number) {
        return `This action returns a #${id} postevent`
    }

    update(id: number, updatePosteventDto: UpdatePosteventDto) {
        return `This action updates a #${id} postevent`
    }

    remove(id: number) {
        return `This action removes a #${id} postevent`
    }
}
