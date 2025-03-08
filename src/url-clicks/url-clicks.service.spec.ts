import { Test, TestingModule } from '@nestjs/testing';
import { UrlClicksService } from './url-clicks.service';

describe('UrlClicksService', () => {
  let service: UrlClicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlClicksService],
    }).compile();

    service = module.get<UrlClicksService>(UrlClicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
