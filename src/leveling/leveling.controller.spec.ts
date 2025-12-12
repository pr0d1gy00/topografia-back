import { Test, TestingModule } from '@nestjs/testing';
import { LevelingController } from './leveling.controller';
import { LevelingService } from './leveling.service';

describe('LevelingController', () => {
  let controller: LevelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelingController],
      providers: [LevelingService],
    }).compile();

    controller = module.get<LevelingController>(LevelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
