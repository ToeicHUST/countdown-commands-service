import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

export class UpdateTargetRequestDto {
  @ApiProperty({
    example: faker.number.int({ min: 0, max: 1000 }),
    description: 'Giá trị điểm số',
  })
  @IsInt()
  scoreValue: number;

  @ApiProperty({
    example: faker.date.future().toISOString(),
    description: 'Ngày mục tiêu',
  })
  @Type(() => Date)
  @IsDate()
  targetDate: Date;
}
