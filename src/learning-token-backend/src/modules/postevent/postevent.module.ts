import { Module } from '@nestjs/common';
import { PosteventService } from './postevent.service';
import { PosteventController } from './postevent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preevent } from '../preevent/entities/preevent.entity';
import { Institution } from '../institutions/entities/institution.entity';
import { SdkKeysModule } from '../sdk-keys/sdk-keys.module';
import { Postevent } from './entities/postevent.entity';

@Module({
  controllers: [PosteventController],
  providers: [PosteventService],
  imports: [TypeOrmModule.forFeature([Preevent, Institution, Postevent]),SdkKeysModule]
})
export class PosteventModule {}
