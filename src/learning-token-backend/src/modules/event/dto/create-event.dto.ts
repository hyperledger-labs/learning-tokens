import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateScoringGuideDTO {
    @IsString()
    meetingEventId: string

    @IsOptional()
    @IsString()
    fieldOfKnowledge: string

    @IsOptional()
    @IsString()
    taxonomyOfSkill: string

    @IsNumber()
    attendanceToken: number

    @IsNumber()
    scoreTokenAmount: number

    @IsNumber()
    helpTokenAmount: number

    @IsNumber()
    instructorScoreToken: number

    @IsOptional()
    @IsString()
    ipfsHash: string
}
