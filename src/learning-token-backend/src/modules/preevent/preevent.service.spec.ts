import { Test, TestingModule } from '@nestjs/testing';
import { PreeventService } from './preevent.service';

describe('PreeventService', () => {
  let service: PreeventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreeventService],
    }).compile();

    service = module.get<PreeventService>(PreeventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
