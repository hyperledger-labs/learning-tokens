import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { Postevent } from '../postevent/entities/postevent.entity'
import { Preevent } from '../preevent/entities/preevent.entity'
import { SmartcontractController } from './smartcontract.controller'
import { SmartcontractService } from './smartcontract.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Preevent,
            Learner,
            Institution,
            Instructor,
            Postevent
        ])
    ],
    controllers: [SmartcontractController],
    providers: [SmartcontractService, ConfigService]
})
export class SmartcontractModule {}
