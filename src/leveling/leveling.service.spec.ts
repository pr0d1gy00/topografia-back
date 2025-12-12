import { Test, TestingModule } from '@nestjs/testing';
import { LevelingService } from './leveling.service';

describe('LevelingService', () => {
  let service: LevelingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelingService],
    }).compile();

    service = module.get<LevelingService>(LevelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
