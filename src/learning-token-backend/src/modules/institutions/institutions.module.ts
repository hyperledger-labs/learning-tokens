import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Institution } from './entities/institution.entity'
import { InstitutionsController } from './institutions.controller'
import { InstitutionsService } from './institutions.service'
import { SdkKeysModule } from '../sdk-keys/sdk-keys.module'

@Module({
    controllers: [InstitutionsController],
    providers: [InstitutionsService],
    imports: [TypeOrmModule.forFeature([Institution]), SdkKeysModule]
})
export class InstitutionsModule {}
