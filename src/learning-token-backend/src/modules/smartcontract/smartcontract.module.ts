import { Module } from '@nestjs/common'
import { SmartcontractService } from './smartcontract.service'
import { SmartcontractController } from './smartcontract.controller'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    controllers: [SmartcontractController],
    providers: [SmartcontractService, ConfigService],
})
export class SmartcontractModule {}
