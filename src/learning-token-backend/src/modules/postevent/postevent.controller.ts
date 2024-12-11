import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpStatus
} from '@nestjs/common'
import { PosteventService } from './postevent.service'
import { CreatePosteventDto } from './dto/create-postevent.dto'
import { UpdatePosteventDto } from './dto/update-postevent.dto'
import { SecretKeyGuard } from '../secret-key/secret-key.guard'

@Controller('postevent')
export class PosteventController {
    constructor(private readonly posteventService: PosteventService) {}

    @UseGuards(SecretKeyGuard)
    @Post()
    async create(@Body() createPosteventDto: CreatePosteventDto) {
        try {
            const result = await this.posteventService.create(
                createPosteventDto
            )
            return {
                status: HttpStatus.CREATED,
                message: 'Post-event created successfully',
                result: result
            }
        } catch (error) {
            console.log(error)
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Something went wrong.'
            }
        }
    }

    @Get(':preeventId')
    async findAll(@Param('preeventId') preeventId: string) {
        console.log('preeventId:::', preeventId);
        
        return this.posteventService.findAll(+preeventId)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.posteventService.findOne(+id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePosteventDto: UpdatePosteventDto
    ) {
        return this.posteventService.update(+id, updatePosteventDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.posteventService.remove(+id)
    }
}
