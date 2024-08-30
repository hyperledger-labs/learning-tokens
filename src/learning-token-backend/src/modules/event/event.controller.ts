import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common'
import { EventService } from './event.service'
import { UpdateEventDto } from './dto/update-event.dto'
import { CreateScoringGuideDTO } from './dto/create-event.dto'
import { CreateEventDto } from './dto/create-scoring-guide.dto'

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventService.create(createEventDto)
    }

    @Post('create-scoring-guide')
    createScoringGuide(@Body() createScoringGuideDTO: CreateScoringGuideDTO) {
        return this.eventService.createScoringGuide(createScoringGuideDTO)
    }

    @Get()
    findAll() {
        return this.eventService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventService.update(+id, updateEventDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventService.remove(+id)
    }
}
