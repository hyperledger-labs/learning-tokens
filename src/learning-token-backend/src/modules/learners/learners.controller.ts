import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common'
import { LearnersService } from './learners.service'
import { CreateLearnerDto } from './dto/create-learner.dto'
import { UpdateLearnerDto } from './dto/update-learner.dto'

@Controller('learners')
export class LearnersController {
    constructor(private readonly learnersService: LearnersService) {}

    @Post()
    create(@Body() createLearnerDto: CreateLearnerDto) {
        return this.learnersService.create(createLearnerDto)
    }

    @Get()
    findAll() {
        return this.learnersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.learnersService.findOne(+id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLearnerDto: UpdateLearnerDto
    ) {
        return this.learnersService.update(+id, updateLearnerDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.learnersService.remove(+id)
    }
}
