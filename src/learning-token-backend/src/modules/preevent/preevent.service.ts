import { Injectable } from '@nestjs/common'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Preevent } from './entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'

@Injectable()
export class PreeventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preeventRepository: Repository<Preevent>,
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>
    ) {}

    async create(createPreeventDto: CreatePreeventDto, secretKey) {
        const institution = await this.institutionRepository.findOne({
            where: { sdkKeys: secretKey }
        })
        
        if (!institution) {
            throw new Error('Institution not found')
        }

        const preevent = await this.preeventRepository.create({
            ...createPreeventDto,
            institution
        }).save()

        return preevent
    }

    findAll() {
        return `This action returns all preevent`
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
