import {
    IsString,
    IsArray,
    ValidateNested,
    IsEmail,
    IsISO8601,
    IsNumber
} from 'class-validator'
import { Type } from 'class-transformer' // Needed for nested validation
import { Preevent } from 'src/modules/preevent/entities/preevent.entity'

export class AttendeeDto {
    @IsString()
    LTId: string

    @IsString()
    name: string

    @IsEmail() // Validate as email
    email: string

    @IsISO8601() // Validate ISO 8601 date format
    joinTime: string // Keep it as string since it's a date string in ISO format

    @IsISO8601() // Validate ISO 8601 date format
    leaveTime: string // Keep it as string since it's a date string in ISO format

    @IsNumber()
    totalTime: number

    @IsNumber()
    attempted: number

    @IsNumber()
    total_questions: number

    @IsNumber()
    total_score: number

    preevent: Preevent
}

export class CreatePosteventDto {
    @IsString()
    meetingEventId: string

    @IsArray() // Validate the array
    @ValidateNested({ each: true }) // Validate each object in the array
    @Type(() => AttendeeDto) // Specify the type of objects in the array
    attendees: AttendeeDto[]
}
