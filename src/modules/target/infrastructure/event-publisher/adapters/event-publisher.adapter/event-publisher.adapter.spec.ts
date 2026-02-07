import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { EventPublisherConfig } from '../../configs/event-publisher.config/event-publisher.config';
import { EventPublisherAdapter } from './event-publisher.adapter';

describe('EventPublisherAdapter', () => {
  let adapter: EventPublisherAdapter;
  let httpService: HttpService;

  const mockConfigUrl = 'https://mock-webhook-url.com';

  // Mock HttpService trả về Observable (vì code dùng firstValueFrom)
  const mockHttpService = {
    post: jest.fn(),
  };

  // Mock Config đơn giản, không cần VaultService
  const mockConfig = {
    MICROSERVICES_WEBHOOK_EVENT_URL: mockConfigUrl,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPublisherAdapter,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: EventPublisherConfig,
          useValue: mockConfig,
        },
      ],
    }).compile();

    adapter = module.get<EventPublisherAdapter>(EventPublisherAdapter);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should call httpService.post with correct URL, payload and headers', async () => {
    const eventName = 'target-updated';
    const payload = { targetId: 'id-1', score: 100 };

    // Mock return success observable
    mockHttpService.post.mockReturnValue(
      of({ data: { success: true }, status: 200 }),
    );

    await adapter.publish(eventName, payload);

    expect(httpService.post).toHaveBeenCalledWith(
      mockConfigUrl, // Kiểm tra xem có lấy đúng URL từ config không
      { eventName, ...payload },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('should throw error when HTTP request fails', async () => {
    const errorMsg = 'Network Error';
    // Mock return error observable
    mockHttpService.post.mockReturnValue(throwError(() => new Error(errorMsg)));

    await expect(adapter.publish('test-event', { data: 1 })).rejects.toThrow(
      errorMsg,
    );
  });
});
