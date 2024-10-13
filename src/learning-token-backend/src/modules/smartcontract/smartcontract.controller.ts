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
    Req
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

    @Get('course-learner-list')
    async getCourseLearnerList(@Body() body: any) {
        const result =
            await this.smartcontractService.findCourseLearnerAddressAndName(
                body
            )
        return result
    }

    @Post('register-actor')
    async registerInstitution(@Body() body: any) {
        const result = await this.smartcontractService.onboardingActor(body)
        return result
    }

    @Post('token-distributions')
    @AllowUserTypes(RoleEnum.INSTRUCTOR)
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
