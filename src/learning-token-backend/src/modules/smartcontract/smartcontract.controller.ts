import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
    DefaultValuePipe,
    ParseIntPipe
} from '@nestjs/common'
import { SmartcontractService } from './smartcontract.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateSmartcontractDto } from './dto/update-smartcontract.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { Allow } from 'class-validator'
import { AllowUserTypes } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from '../admins/enums/user.enum'
import { DistributeTokenDto } from './dto/distrbute-token.dto'

@Controller('smartcontract')
export class SmartcontractController {
    constructor(private readonly smartcontractService: SmartcontractService) {}

    @Get()
    findAll() {
        return this.smartcontractService.findAll()
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

    @Post('register-actor')
    async registerInstitution(@Body() body: any) {
        const result = await this.smartcontractService.onboardingActor(body)
        return result
    }

    @UseGuards(JwtAuthGuard)
    @AllowUserTypes(RoleEnum.INSTRUCTOR)
    @Post('token-distributions')
    async distributeToken(
        @Req() req: Request,
        @Body() distributeToken: DistributeTokenDto
    ) {
        const result = await this.smartcontractService.distributeToken(
            req,
            distributeToken
        )
        return result
    }

    @Get('course-learner-list')
    async getCourseLearnerList(
        @Query('preEventId', new DefaultValuePipe(1), ParseIntPipe)
        preEventId: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number
    ) {
        const result =
            await this.smartcontractService.findCourseLearnerAddressAndName(
                +preEventId,
                page,
                limit
            )
        return result
    }

    @UseGuards(JwtAuthGuard)
    @AllowUserTypes(RoleEnum.INSTRUCTOR)
    @Post('create-course')
    async createCourse(
        @Req() req: Request,
        @Body() createCourseDto: CreateCourseDto
    ) {
        const result = await this.smartcontractService.createCourse(
            req,
            createCourseDto
        )
        return result
    }
}
