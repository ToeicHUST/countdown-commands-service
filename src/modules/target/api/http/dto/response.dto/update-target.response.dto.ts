import { BaseResponseDto } from '@toeichust/common';

export interface DataUpdateTargetResponseDto {
  id: string;
  learnerId: string;
  score: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateTargetResponseDto extends BaseResponseDto<DataUpdateTargetResponseDto> {}
