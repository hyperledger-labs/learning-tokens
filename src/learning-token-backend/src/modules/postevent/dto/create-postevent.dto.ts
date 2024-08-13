import { IsString } from "class-validator"

export class CreatePosteventDto {
    @IsString()
    eventId: string

    @IsString()
    name: string
    
    @IsString()
    email: string
    
    @IsString()
    joinTime: Date
    
    @IsString()
    leaveTime: Date
}