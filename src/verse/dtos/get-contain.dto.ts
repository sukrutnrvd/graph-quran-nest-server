import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class GetContainDto {
  @ArrayUnique()
  @ArrayMaxSize(10, { message: 'Roots must contain no more than 10 elements' })
  @IsNumber({}, { each: true, message: 'Roots should be an array of numbers' })
  @ArrayNotEmpty({
    message: 'Roots should not be empty',
  })
  @IsNotEmpty({ message: 'Roots should be defined' })
  roots: number[];
}
