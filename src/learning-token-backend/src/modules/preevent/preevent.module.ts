import { Module } from '@nestjs/common';
import { PreeventService } from './preevent.service';
import { PreeventController } from './preevent.controller';
import { SdkKeysModule } from '../sdk-keys/sdk-keys.module';
import { Institution } from '../institutions/entities/institution.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preevent } from './entities/preevent.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { JwtService } from '../auth/service/jwt.service';

@Module({
  controllers: [PreeventController],
  providers: [PreeventService],
  imports: [TypeOrmModule.forFeature([Preevent, Institution, Instructor, JwtService]),SdkKeysModule]
})
export class PreeventModule {}
