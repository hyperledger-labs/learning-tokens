import { HttpException, Injectable, Inject } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/modules/auth/service/jwt.service';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) { }

  onboardingInstructor(createInstructorDto: CreateInstructorDto) {
    try {
      createInstructorDto.password = this.jwtService.encodePassword(createInstructorDto.password)
      createInstructorDto.roleId = 2; // default to instructor
      const instructor = this.instructorRepository.create(createInstructorDto);
      return this.instructorRepository.save(instructor);
    } catch (error) {
      throw new HttpException('Error in creating instructor', 400, { cause: new Error(error) });
    }
  }

  create(createInstructorDto: CreateInstructorDto) {
    return 'This action adds a new instructor';
  }

  findAll() {
    return `This action returns all instructors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instructor`;
  }

  update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }
}
