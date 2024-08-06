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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CreateInstitutionDto } from './dto/create-institution.dto'
import { UpdateInstitutionDto } from './dto/update-institution.dto'
import { InstitutionsService } from './institutions.service'

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

    @Get('gen-sdk-keys/:id')
    @UseGuards(JwtAuthGuard)
    generateSdkKeyForInstitution(@Param('id') id: string) {
        return this.institutionsService.generateSdkKeyForInstitution(+id)
    }

    @Delete('sdk-keys/:id')
    @UseGuards(JwtAuthGuard)
    deleteSdkKeyForInstitution(
        @Param('id') id: string,
        @Body() body: { sdkKey: string }
    ) {
        return this.institutionsService.deleteSdkKeyForInstitution(
            +id,
            body.sdkKey
        )
    }
    @Get('all-sdk-keys/:id')
    @UseGuards(JwtAuthGuard)
    getAllSdkKeysForInstitution(@Param('id') id: string) {
        return this.institutionsService.getAllSdkKeysForInstitution(+id)
    }

    @Post('validate-sdk-key/:id')
    @UseGuards(JwtAuthGuard)
    validateSdkKeyForInstitution(
        @Param('id') id: string,
        @Body('sdkKey') sdkKey: string
    ) {
        return this.institutionsService.validateSdkKeyForInstitution(
            +id,
            sdkKey
        )
    }
}
