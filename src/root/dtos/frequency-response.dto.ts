import { Root, Verses } from '.';

import { Expose } from 'class-transformer';

export class FrequencyResponseDto {
  @Expose()
  root: Root;
  @Expose()
  verses: Verses[];
  @Expose()
  count: number;
}
