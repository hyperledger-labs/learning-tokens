import { Test, TestingModule } from '@nestjs/testing';
import { LearnersService } from './learners.service';

describe('LearnersService', () => {
  let service: LearnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearnersService],
    }).compile();

    service = module.get<LearnersService>(LearnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
