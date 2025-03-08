import { Test, TestingModule } from '@nestjs/testing';
import { UrlClicksController } from './url-clicks.controller';

describe('UrlClicksController', () => {
  let controller: UrlClicksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlClicksController],
    }).compile();

    controller = module.get<UrlClicksController>(UrlClicksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
