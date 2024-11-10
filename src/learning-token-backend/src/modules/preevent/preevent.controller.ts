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
    Req,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    ParseBoolPipe
} from '@nestjs/common'
import { PreeventService } from './preevent.service'
import { CreatePreeventDto } from './dto/create-preevent.dto'
import { UpdatePreeventDto } from './dto/update-preevent.dto'
import { Request } from 'express'
import { SecretKeyGuard } from '../secret-key/secret-key.guard'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { Role } from '../role/entities/role.entity'
import { RoleEnum } from '../admins/enums/user.enum'
import { AllowUserTypes } from 'src/common/decorators/roles.decorator'
import { AccessControlGuard } from 'src/common/guards/access-control.guard'

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

    @UseGuards(JwtAuthGuard)
    @Get()
    async InstructorAssignedPreEventData(
        @Req() request: Request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
        @Query('search', new DefaultValuePipe('')) search = '',
        @Query('orderBy', new DefaultValuePipe('createdAt'))
        orderBy = 'createdAt',
        @Query('desc', new DefaultValuePipe(true), ParseBoolPipe)
        desc = true
    ) {
        limit = limit
            ? limit > parseInt(process.env.DEFAULT_PAGE_SIZE)
                ? parseInt(process.env.DEFAULT_PAGE_SIZE)
                : limit
            : parseInt(process.env.DEFAULT_PAGE_SIZE)

        const result =
            await this.preeventService.findAllPreventDataForInstructor(
                request.user,
                {
                    page,
                    limit,
                    route: process.env.APP_URL + ''
                },
                search,
                orderBy,
                desc
            )

        return {
            status: HttpStatus.OK,
            message: 'Data found',
            result: result.items,
            meta: result.meta,
            links: result.links
        }
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
