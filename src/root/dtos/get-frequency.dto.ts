import { IsNumber } from 'class-validator';

export class GetFrequencyDto {
  @IsNumber({}, { message: 'Root should be a number' })
  root: number;
}
