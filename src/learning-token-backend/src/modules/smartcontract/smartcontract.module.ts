import { Module, Post } from '@nestjs/common'
import { SmartcontractService } from './smartcontract.service'
import { SmartcontractController } from './smartcontract.controller'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Postevent } from '../postevent/entities/postevent.entity'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { OnlineEvent } from '../event/entities/event.entity'
import { ScoringGuide } from '../event/entities/scoring-guide.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Preevent,
            Learner,
            Institution,
            Instructor,
            Postevent,
            ScoringGuide,
            OnlineEvent
        ])
    ],
    controllers: [SmartcontractController],
    providers: [SmartcontractService, ConfigService],
    exports: [SmartcontractService]
})
export class SmartcontractModule {}
