import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionsService } from './institutions.service';

describe('InstitutionsService', () => {
  let service: InstitutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstitutionsService],
    }).compile();

    service = module.get<InstitutionsService>(InstitutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
