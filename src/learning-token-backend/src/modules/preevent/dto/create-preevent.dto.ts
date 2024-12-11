import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreatePreeventDto {
    @IsString()
    meetingEventId: string

    @IsString()
    eventName: string

    @IsString()
    organizerName: string

    @IsString()
    organizerEmail: string

    @IsString()
    eventType: string

    @IsString()
    description: string

    @IsString()
    eventDate: Date

    @IsArray()
    speakersName: string[]

    @IsArray()
    speakersEmail: string[]

    @IsOptional()
    @IsString()
    organization: string

    @IsOptional()
    @IsString()
    community: string

    @IsOptional()
    @IsString()
    fieldsOfKnowledge: string

    @IsOptional()
    @IsString()
    taxonomyOfSkills: string

}
