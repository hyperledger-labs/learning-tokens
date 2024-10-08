import { Injectable } from '@nestjs/common'
import { CreatePosteventDto } from './dto/create-postevent.dto'
import { UpdatePosteventDto } from './dto/update-postevent.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Postevent } from './entities/postevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import * as bcrypt from 'bcryptjs'
import { getWallet } from 'src/utils/kaledio'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
@Injectable()
export class PosteventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Postevent)
        private readonly posteventRepository: Repository<Postevent>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>,
        private readonly dataSource: DataSource,
        @InjectEntityManager()
        private readonly entityManager: EntityManager
    ) {}
    async create(createPosteventDto: CreatePosteventDto) {
        const event = await this.preeventRepository.findOne({
            where: { meetingEventId: createPosteventDto.meetingEventId }
        })
        if (!event) {
            throw new Error('Institution not found')
        }

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
                await this.posteventRepository.save(postevent)
                if (!learner) {
                    const _learner = new Learner()
                    _learner.name = element.name
                    _learner.email = element.email

                    const salt: string = bcrypt.genSaltSync(10)
                    _learner.password = bcrypt.hashSync('12345678', salt)

                    const registeredLearner = await this.learnerRepository.save(
                        _learner
                    )

                    // sendLoginCredentials(
                    //     element.email,
                    //     element.email,
                    //     '12345678',
                    //     'Dear learner, Please login with credentials'
                    // ).then((res) => {
                    //     console.log(res)
                    // })

                    const _user = await this.learnerRepository.findOneBy({
                        id: registeredLearner.id
                    })

                    const wallet = await getWallet(
                        'learner',
                        registeredLearner.id
                    )
                    _user.publicAddress = wallet.address

                    await this.learnerRepository.save(_user)
                }
            }
        })
        return
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
