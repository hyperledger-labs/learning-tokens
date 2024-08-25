import { Inject, Injectable } from '@nestjs/common'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Preevent } from './entities/preevent.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { JwtService } from '../auth/service/jwt.service'
import { getWallet } from 'src/utils/kaledio'
import * as bcrypt from 'bcryptjs'
import { sendLoginCredentials } from 'src/common/helpers/utils.helper'
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
            // Create Preevent
            preevent = manager.create(Preevent, {
                ...createPreeventDto,
                institution
            })
            await manager.save(Preevent, preevent)

            const instructor = await manager.findOneBy(Instructor, {
                email: preevent.speakerEmail
            })

            if (!instructor) {
                const _instructor = new Instructor()
                _instructor.name = preevent.speakerName
                _instructor.email = preevent.speakerEmail

                const salt: string = bcrypt.genSaltSync(10)
                _instructor.password = bcrypt.hashSync('12345678', salt)

                const registeredInstructor = await manager.save(
                    Instructor,
                    _instructor
                )

                sendLoginCredentials(preevent.speakerEmail,preevent.speakerEmail,'12345678',"Dear Instructor, Please login with credentials").then((res) => {
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
