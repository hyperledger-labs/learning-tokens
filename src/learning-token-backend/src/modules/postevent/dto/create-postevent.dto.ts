import { IsString } from 'class-validator'
import { OnlineEvent } from 'src/modules/event/entities/event.entity'
import { Preevent } from 'src/modules/preevent/entities/preevent.entity'

export class CreatePosteventDto {
    @IsString()
    meetingEventId: string

    @IsString()
    name: string

    @IsString()
    email: string

    @IsString()
    joinTime: Date

    @IsString()
    leaveTime: Date

    preevent: Preevent
}
