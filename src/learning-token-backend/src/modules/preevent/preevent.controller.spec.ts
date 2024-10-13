import { Test, TestingModule } from '@nestjs/testing';
import { PreeventController } from './preevent.controller';
import { PreeventService } from './preevent.service';

describe('PreeventController', () => {
  let controller: PreeventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreeventController],
      providers: [PreeventService],
    }).compile();

    controller = module.get<PreeventController>(PreeventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
