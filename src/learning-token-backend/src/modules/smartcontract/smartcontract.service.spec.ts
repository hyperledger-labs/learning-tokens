import { Test, TestingModule } from '@nestjs/testing';
import { SmartcontractService } from './smartcontract.service';

describe('SmartcontractService', () => {
  let service: SmartcontractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartcontractService],
    }).compile();

    service = module.get<SmartcontractService>(SmartcontractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
