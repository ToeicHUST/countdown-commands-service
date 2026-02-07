import { InvalidScoreException } from '../../../../../../lib/exceptions/invalid-score.exception/invalid-score.exception';
import { Score } from '../../../../../../lib/value-objects/score/score';
import { Target } from '../../entities/target/target';
import { TargetFactory } from './target.factory';

describe('TargetFactory', () => {
  describe('create', () => {
    it('should create a new Target with generated ID and timestamps', () => {
      const userId = 'user-123';
      const scoreValue = 450;
      const targetDate = new Date('2026-12-31');

      const target = TargetFactory.create(
        userId,
        new Score(scoreValue),
        targetDate,
      );

      // Kiểm tra instance
      expect(target).toBeInstanceOf(Target);

      // Kiểm tra dữ liệu đầu vào
      expect(target.userId).toBe(userId);
      expect(target.targetDate).toBe(targetDate);

      // Kiểm tra Value Object Score được khởi tạo đúng
      expect(target.score).toBeInstanceOf(Score);
      expect(target.score?.value).toBe(450);

      // Kiểm tra các trường được tự động sinh ra
      expect(target.id).toBeDefined();
      expect(typeof target.id).toBe('string'); // UUID
      expect(target.createdAt).toBeInstanceOf(Date);
      expect(target.updatedAt).toBeInstanceOf(Date);

      // Thời gian tạo và cập nhật phải bằng nhau khi mới tạo
      expect(target.createdAt.getTime()).toBe(target.updatedAt.getTime());
    });

    it('should create a Target with null score and null date', () => {
      const target = TargetFactory.create('user-1', null, null);

      expect(target.score).toBeNull();
      expect(target.targetDate).toBeNull();
      expect(target.id).toBeDefined();
    });

    it('should throw InvalidScoreException if score is invalid', () => {
      // Test xem Factory có để lọt lỗi validation của Score ra ngoài không
      expect(() => {
        TargetFactory.create('user-1', new Score(9999), null); // 9999 > 990
      }).toThrow(InvalidScoreException);
    });
  });
});
