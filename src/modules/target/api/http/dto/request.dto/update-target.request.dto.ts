import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateTargetRequestDto {
  @ApiProperty({
    example: 500,
    description: 'Giá trị điểm số',
  })
  @IsInt()
  @IsNotEmpty({ message: 'Score không được để trống' })
  @Min(10, { message: 'Score tối thiểu là 10' })
  @Max(990, { message: 'Score tối đa là 990' })
  scoreValue: number;

  @ApiProperty({
    example: '2026-12-31T09:00:00.000Z',
    description: 'Ngày mục tiêu',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'Target date không được để trống' })
  targetDate: Date;
}
