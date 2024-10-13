import { Test, TestingModule } from '@nestjs/testing';
import { LearnersController } from './learners.controller';
import { LearnersService } from './learners.service';

describe('LearnersController', () => {
  let controller: LearnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnersController],
      providers: [LearnersService],
    }).compile();

    controller = module.get<LearnersController>(LearnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
