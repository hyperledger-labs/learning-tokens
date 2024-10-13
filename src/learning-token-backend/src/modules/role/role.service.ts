import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        const insertionData = this.roleRepository.create(createRoleDto)
        return await this.roleRepository.save(insertionData)
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        const previousData = await this.roleRepository.findOne({
            where: { id: id }
        })
        if (!previousData) {
            return
        }

        return await this.roleRepository.save(updateRoleDto)
    }
}
