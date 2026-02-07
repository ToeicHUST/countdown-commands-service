export class UpdateTargetResponseDto {
  message: string;
  data: {
    id: string;
    userId: string;
    score: number | null;
    targetDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
