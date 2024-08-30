import { IsOptional, IsString } from 'class-validator'

export class CreateScoringGuideDTO {
    @IsString()
    meetingEventId: string

    @IsOptional()
    @IsString()
    fieldOfKnowledge: string

    @IsOptional()
    @IsString()
    taxonomyOfSkill: string

    @IsOptional()
    @IsString()
    ipfsUrl: string
}
