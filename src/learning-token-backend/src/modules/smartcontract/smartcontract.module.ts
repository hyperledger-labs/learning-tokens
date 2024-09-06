import { Module, Post } from '@nestjs/common'
import { SmartcontractService } from './smartcontract.service'
import { SmartcontractController } from './smartcontract.controller'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Postevent } from '../postevent/entities/postevent.entity'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Learner } from '../learners/entities/learner.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Preevent, Learner])],
    controllers: [SmartcontractController],
    providers: [SmartcontractService, ConfigService]
})
export class SmartcontractModule {}
