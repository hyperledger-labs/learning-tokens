import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query
} from '@nestjs/common'
import { SmartcontractService } from './smartcontract.service'
import { CreateSmartcontractDto } from './dto/create-smartcontract.dto'
import { UpdateSmartcontractDto } from './dto/update-smartcontract.dto'

@Controller('smartcontract')
export class SmartcontractController {
    constructor(private readonly smartcontractService: SmartcontractService) {}

    @Post()
    create(@Body() createSmartcontractDto: CreateSmartcontractDto) {
        return this.smartcontractService.create(createSmartcontractDto)
    }

    @Get()
    findAll() {
        return this.smartcontractService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.smartcontractService.findOne(+id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSmartcontractDto: UpdateSmartcontractDto
    ) {
        return this.smartcontractService.update(+id, updateSmartcontractDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.smartcontractService.remove(+id)
    }

    @Post('smartcontract')
    async getInstitutionId(@Body() body: any) {
        const result = await this.smartcontractService.callContractFunction(
            body.functionName,
            body
        )
        return result
    }
}
