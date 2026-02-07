import { Test, TestingModule } from '@nestjs/testing';
import { VaultService } from '@toeichust/common';
import { EventPublisherConfig } from './event-publisher.config';

describe('EventPublisherConfig', () => {
  let config: EventPublisherConfig;
  let vaultService: VaultService;

  const mockVaultService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPublisherConfig,
        {
          provide: VaultService,
          useValue: mockVaultService,
        },
      ],
    }).compile();

    vaultService = module.get<VaultService>(VaultService);
    config = module.get<EventPublisherConfig>(EventPublisherConfig);
  });

  it('should be defined', () => {
    expect(config).toBeDefined();
  });

  it('should get MICROSERVICES_WEBHOOK_EVENT_URL from VaultService', () => {
    const testUrl = 'https://test-webhook.com';
    mockVaultService.get.mockReturnValue(testUrl);

    const newConfig = new EventPublisherConfig(vaultService);

    expect(vaultService.get).toHaveBeenCalledWith(
      'MICROSERVICES_WEBHOOK_EVENT_URL',
    );
    expect(newConfig.MICROSERVICES_WEBHOOK_EVENT_URL).toBe(testUrl);
  });

  it('should handle missing config gracefully (log warning)', () => {
    mockVaultService.get.mockReturnValue(undefined);

    const loggerSpy = jest
      .spyOn(require('@nestjs/common').Logger.prototype, 'warn')
      .mockImplementation(() => {});

    new EventPublisherConfig(vaultService);

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('MICROSERVICES_WEBHOOK_EVENT_URL is not set!'),
    );
  });
});
