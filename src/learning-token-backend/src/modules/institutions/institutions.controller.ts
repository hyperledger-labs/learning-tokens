import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common'
import { CreateInstitutionDto } from './dto/create-institution.dto'
import { UpdateInstitutionDto } from './dto/update-institution.dto'
import { InstitutionsService } from './institutions.service'
import { SecretKeyGuard } from '../secret-key/secret-key.guard'

@Controller('institutions')
export class InstitutionsController {
    constructor(private readonly institutionsService: InstitutionsService) {}

    @Post()
    create(@Body() createInstitutionDto: CreateInstitutionDto) {
        return this.institutionsService.create(createInstitutionDto)
    }

    @Get()
    findAll() {
        return this.institutionsService.findAll()
    }

    @UseGuards(SecretKeyGuard)
    @Get('test')
    async testingSdk() {
        try {
            return { result: await this.institutionsService.findAll() }
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.institutionsService.findOne(+id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateInstitutionDto: UpdateInstitutionDto
    ) {
        return this.institutionsService.update(+id, updateInstitutionDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.institutionsService.remove(+id)
    }
}
// make new module for sdk keys
// together with test cases
