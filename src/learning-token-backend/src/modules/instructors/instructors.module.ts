import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';

@Module({
  controllers: [InstructorsController],
  providers: [InstructorsService]
})
export class InstructorsModule {}
