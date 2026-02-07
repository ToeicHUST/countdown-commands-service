import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

export class UpdateTargetRequestDto {
  @ApiProperty({
    example: 500,
    description: 'Giá trị điểm số',
  })
  @IsInt()
  scoreValue: number;

  @ApiProperty({
    example: '2026-12-31T09:00:00.000Z',
    description: 'Ngày mục tiêu',
  })
  @Type(() => Date)
  @IsDate()
  targetDate: Date;
}
