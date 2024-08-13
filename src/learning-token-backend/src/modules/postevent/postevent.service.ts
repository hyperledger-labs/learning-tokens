import { Injectable } from '@nestjs/common'
import { CreatePosteventDto } from './dto/create-postevent.dto'
import { UpdatePosteventDto } from './dto/update-postevent.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Repository } from 'typeorm'
import { Postevent } from './entities/postevent.entity'

@Injectable()
export class PosteventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Postevent)
        private readonly posteventRepository: Repository<Postevent>
    ) {}
    async create(createPosteventDto: CreatePosteventDto[]) {
        const event = await this.preeventRepository.findOne({
            where: { eventId: createPosteventDto[0].eventId }
        })

        if (!event) {
            throw new Error('Institution not found')
        }

        
        const postevent = this.posteventRepository.create(createPosteventDto)

        const saved = await this.posteventRepository.save(postevent);

        return saved
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
