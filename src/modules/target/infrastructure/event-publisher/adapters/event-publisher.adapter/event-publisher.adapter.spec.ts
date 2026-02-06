import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisherAdapter } from './event-publisher.adapter';

describe('EventPublisherAdapter', () => {
  let adapter: EventPublisherAdapter;
  let mockHttpService: { post: jest.Mock };

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(() => ({
        toPromise: jest.fn().mockResolvedValue({ status: 200 }),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPublisherAdapter,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    adapter = module.get<EventPublisherAdapter>(EventPublisherAdapter);
  });

  it('should call httpService.post with correct URL and payload', async () => {
    const payload = { targetId: 'id-1', userId: 'user-1', score: 500 };

    await adapter.publish('target-updated', payload);

    expect(mockHttpService.post).toHaveBeenCalledWith(
      'https://webhook.site/3add811f-d647-498f-a149-11a3ba63756c',
      expect.objectContaining({
        eventName: 'target-updated',
        targetId: 'id-1',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Event-Name': 'target-updated',
        }),
      }),
    );
  });

  it('should throw when HTTP request fails', async () => {
    mockHttpService.post.mockReturnValue({
      toPromise: jest.fn().mockRejectedValue(new Error('Network failure')),
    });

    await expect(
      adapter.publish('target-updated', { targetId: 'x' }),
    ).rejects.toThrow('Network failure');
  });
});
