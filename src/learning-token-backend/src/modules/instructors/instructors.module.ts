import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [InstructorsController],
  providers: [InstructorsService],
  imports: [TypeOrmModule.forFeature([Instructor]), AuthModule],
})
export class InstructorsModule {}
