import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Institution } from '../institutions/entities/institution.entity'
import { SdkKeysController } from './sdk-keys.controller'
import { SdkKeysService } from './sdk-keys.service'

@Module({
    controllers: [SdkKeysController],
    providers: [SdkKeysService],
    imports: [TypeOrmModule.forFeature([Institution])],
    exports: [SdkKeysService]
})
export class SdkKeysModule {}
