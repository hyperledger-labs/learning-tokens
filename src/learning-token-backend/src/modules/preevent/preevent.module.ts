import { Module } from '@nestjs/common';
import { PreeventService } from './preevent.service';
import { PreeventController } from './preevent.controller';
import { SdkKeysModule } from '../sdk-keys/sdk-keys.module';
import { Institution } from '../institutions/entities/institution.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preevent } from './entities/preevent.entity';

@Module({
  controllers: [PreeventController],
  providers: [PreeventService],
  imports: [TypeOrmModule.forFeature([Preevent, Institution]),SdkKeysModule]
})
export class PreeventModule {}
