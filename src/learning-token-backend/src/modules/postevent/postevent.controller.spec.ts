import { Test, TestingModule } from '@nestjs/testing';
import { PosteventController } from './postevent.controller';
import { PosteventService } from './postevent.service';

describe('PosteventController', () => {
  let controller: PosteventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosteventController],
      providers: [PosteventService],
    }).compile();

    controller = module.get<PosteventController>(PosteventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
