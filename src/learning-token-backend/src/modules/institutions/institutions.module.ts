import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Institution } from './entities/institution.entity'
import { InstitutionsController } from './institutions.controller'
import { InstitutionsService } from './institutions.service'

@Module({
    controllers: [InstitutionsController],
    providers: [InstitutionsService],
    imports: [TypeOrmModule.forFeature([Institution])]
})
export class InstitutionsModule {}
