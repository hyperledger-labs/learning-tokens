import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    UseGuards
} from '@nestjs/common'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { SdkKeysService } from './sdk-keys.service'

@Controller('sdk-keys')
export class SdkKeysController {
    constructor(private readonly sdkKeysService: SdkKeysService) {}

    @Get('gen/:id')
    @UseGuards(JwtAuthGuard)
    async generateSdkKeyForInstitution(@Param('id') id: string) {
        try {
            return {
                status: HttpStatus.CREATED,
                message: 'Key Generated',
                result: await this.sdkKeysService.generateSdkKeyForInstitution(
                    +id
                )
            }
        } catch (error) {
            console.log(error)
            throw new NotFoundException('Something went wrong')
        }
    }

    @Get('get/:id')
    // @UseGuards(JwtAuthGuard)
    async getSdkKeyForInstitution(@Param('id') id: string) {
        try {
            return {
                status: HttpStatus.OK,
                message: 'Key Fetched',
                result: await this.sdkKeysService.getSdkKeyForInstitution(+id)
            }
        } catch (error) {
            throw new NotFoundException('Something went wrong')
        }
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    deleteSdkKeyForInstitution(
        @Param('id') id: string,
        @Body() body: { sdkKey: string }
    ) {
        return this.sdkKeysService.deleteSdkKeyForInstitution(+id, body.sdkKey)
    }

    @Get('all/:id')
    @UseGuards(JwtAuthGuard)
    getAllSdkKeysForInstitution(@Param('id') id: string) {
        return this.sdkKeysService.getAllSdkKeysForInstitution(+id)
    }
}
