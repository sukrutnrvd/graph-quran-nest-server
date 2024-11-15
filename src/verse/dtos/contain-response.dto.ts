import { Expose, Type } from 'class-transformer';

import { Root } from '.';

export class ContainResponseDto {
  @Expose()
  @Type(() => Root)
  roots: Root[];

  @Expose()
  surah: number;

  @Expose()
  verse: number;
}
