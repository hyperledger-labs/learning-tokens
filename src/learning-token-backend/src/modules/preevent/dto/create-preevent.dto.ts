import { IsString } from "class-validator";

export class CreatePreeventDto {
    @IsString()
    eventId: string

    @IsString()
    eventName: string
    
    @IsString()
    eventType: string

    @IsString()
    description: string
    
    @IsString()
    eventDate: Date
    
    @IsString()
    speakerName: string

    @IsString()
    speakerEmail: string

    @IsString()
    speakerTitle: string

    @IsString()
    organization: string
}
