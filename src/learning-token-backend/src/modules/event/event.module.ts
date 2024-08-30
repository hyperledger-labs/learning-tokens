import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { EventController } from './event.controller'
import { Type } from 'class-transformer'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScoringGuide } from './entities/scoring-guide.entity'
import { OnlineEvent } from './entities/event.entity'
import { Preevent } from '../preevent/entities/preevent.entity'

@Module({
    imports: [TypeOrmModule.forFeature([OnlineEvent, ScoringGuide, Preevent])],
    controllers: [EventController],
    providers: [EventService]
})
export class EventModule {}
