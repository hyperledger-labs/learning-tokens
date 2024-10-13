import { Controller, Get, HttpStatus } from '@nestjs/common'
import { response } from 'src/common/helpers/utils.helper'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello() {
        return response(HttpStatus.OK, 'Congratulations, You are hooked!!!', [])
    }
}
