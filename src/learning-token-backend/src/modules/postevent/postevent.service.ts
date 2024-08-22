import { Injectable } from '@nestjs/common'
import { CreatePosteventDto } from './dto/create-postevent.dto'
import { UpdatePosteventDto } from './dto/update-postevent.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { DataSource, Repository } from 'typeorm'
import { Postevent } from './entities/postevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import * as bcrypt from 'bcryptjs'
import { getWallet } from 'src/utils/kaledio'
@Injectable()
export class PosteventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Postevent)
        private readonly posteventRepository: Repository<Postevent>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>,
        private readonly dataSource: DataSource
    ) {}
    async create(createPosteventDto: CreatePosteventDto[]) {
        const event = await this.preeventRepository.findOne({
            where: { eventId: createPosteventDto[0].eventId }
        })

        if (!event) {
            throw new Error('Institution not found')
        }


        let postevent: Postevent[]
        await this.dataSource.transaction(async (manager) => {
            postevent = manager.create(Postevent, createPosteventDto)
            await manager.save(Postevent, postevent)

            for (let index = 0; index < postevent.length; index++) {
                const element = postevent[index];
                const learner = await manager.findOneBy(Learner, {
                    email: element.email
                })
                if (!learner) {
                    const _learner = new Learner()
                    _learner.name = element.name
                    _learner.email = element.email
    
                    const salt: string = bcrypt.genSaltSync(10)
                    _learner.password = bcrypt.hashSync('12345678', salt)
    
                    const registeredLearner = await manager.save(
                        Learner,
                        _learner
                    )
    
                    const _user = await manager.findOneBy(Learner, {
                        id: registeredLearner.id
                    })
    
                    const wallet = await getWallet(
                        'learner',
                        registeredLearner.id
                    )
                    _user.publicAddress = wallet.address
    
                    await manager.save(Learner, _user)
                }
            }
        })

        return postevent
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
