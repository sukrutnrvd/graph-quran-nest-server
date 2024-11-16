import { Expose, Transform, Type } from 'class-transformer';
import { Root, Verses } from '.';

export class RelationsResponseDto {
  @Expose()
  @Type(() => Root)
  roots: Root[];

  @Expose()
  @Type(() => Verses)
  verses: Verses[];
}
