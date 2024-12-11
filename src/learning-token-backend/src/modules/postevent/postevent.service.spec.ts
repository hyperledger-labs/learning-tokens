import { Test, TestingModule } from '@nestjs/testing';
import { PosteventService } from './postevent.service';

describe('PosteventService', () => {
  let service: PosteventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosteventService],
    }).compile();

    service = module.get<PosteventService>(PosteventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
