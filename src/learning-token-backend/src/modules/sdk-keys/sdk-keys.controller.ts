import { Body, Controller, Delete, Get, Param, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { SdkKeysService } from './sdk-keys.service'

@Controller('sdk-keys')
export class SdkKeysController {
    constructor(private readonly sdkKeysService: SdkKeysService) {}

    @Get('gen/:id')
    @UseGuards(JwtAuthGuard)
    generateSdkKeyForInstitution(@Param('id') id: string) {
        return this.sdkKeysService.generateSdkKeyForInstitution(+id)
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
