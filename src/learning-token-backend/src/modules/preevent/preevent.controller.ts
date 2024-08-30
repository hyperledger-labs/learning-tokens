import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    NotFoundException,
    UseGuards,
    Req
} from '@nestjs/common'
import { PreeventService } from './preevent.service'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { SecretKeyGuard } from 'src/secret-key/secret-key.guard'
import { Request } from 'express'

@Controller('preevent')
export class PreeventController {
    constructor(private readonly preeventService: PreeventService) {}

    @UseGuards(SecretKeyGuard)
    @Post()
    async create(
        @Body() createPreeventDto: CreatePreeventDto,
        @Req() request: Request
    ) {
        try {
            const secretKey = request.headers['secretkey']
            const result = await this.preeventService.create(
                createPreeventDto,
                secretKey
            )
            return {
                status: HttpStatus.CREATED,
                message: 'Pre-event created successfully',
                result: result
            }
        } catch (error) {
            console.log(error)

            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Something went wrong'
            }
        }
    }

    //find all event lists
    @Get()
    findAll() {
        return this.preeventService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.preeventService.findOne(+id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePreeventDto: UpdatePreeventDto
    ) {
        return this.preeventService.update(+id, updatePreeventDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.preeventService.remove(+id)
    }
}
