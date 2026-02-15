import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { EventPublisherPort, JwtAuthGuard } from '@toeichust/common';
import { of } from 'rxjs';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { main } from './common/utils/main.util';

describe('UpdateTargetController (e2e)', () => {
  let app: INestApplication;
  const MOCK_USER_ID = 'user-test-123';

  beforeAll(async () => {
    app = await main(AppModule, (builder) => {
      builder.overrideGuard(JwtAuthGuard).useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            userId: MOCK_USER_ID,
            email: 'test@example.com',
          };
          return true;
        },
      } as CanActivate);

      builder.overrideProvider(EventPublisherPort).useValue({
        publish: jest.fn().mockReturnValue(of({ data: {} })),
      });
    });
  });

  describe('PATCH /api/target', () => {
    it('should update target successfully (Valid Data)', async () => {
      const payload = {
        scoreValue: 500,
        targetDate: '2026-12-31T09:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/target')
        .send(payload)
        .expect(200);

      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBeDefined();

      expect(response.body.message).toBe('Target updated successfully');

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.learnerId).toBe(MOCK_USER_ID);
      expect(response.body.data.score).toBe(500);
      expect(response.body.data.targetDate).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should fail when scoreValue is too small (Negative)', async () => {
      const payload = {
        scoreValue: -5,
      };

      const response = await request(app.getHttpServer())
        .patch('/api/target')
        .send(payload)
        .expect(400);

      expect(response.body.message).toBe(
        'Invalid Score value: -5. Must be between 10-990 and divisible by 5.',
      );
      expect(response.body.data).toBeNull();
    });

    it('should fail when scoreValue is too large (> 990)', async () => {
      const payload = {
        scoreValue: 1000,
        targetDate: '2026-12-31T09:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/target')
        .send(payload)
        .expect(400);

      expect(response.body.message).toBe(
        'Invalid Score value: 1000. Must be between 10-990 and divisible by 5.',
      );
      expect(response.body.data).toBeNull();
    });

    it('should fail when scoreValue is not divisible by 5', async () => {
      const payload = {
        scoreValue: 503,
        targetDate: '2026-12-31T09:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/target')
        .send(payload)
        .expect(400);

      expect(response.body.message).toBe(
        'Invalid Score value: 503. Must be between 10-990 and divisible by 5.',
      );
      expect(response.body.data).toBeNull();
    });

    it('should fail when scoreValue is null or missing', async () => {
      const payload = {
        scoreValue: null,
        targetDate: '2026-12-31T09:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/target')
        .send(payload)
        .expect(400);

      expect(response.body.message).toBe(
        'Invalid Score value: null. Must be between 10-990 and divisible by 5.',
      );
      expect(response.body.data).toBeNull();
    });
  });
});
