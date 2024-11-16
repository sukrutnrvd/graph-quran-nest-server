import { Expose, plainToClass } from 'class-transformer';
import { QueryResult, RecordShape } from 'neo4j-driver';

import { RelationsResponseDto } from './relations-response.dto';
import { Utils } from 'src/utils/utils';

export class Root {
  @Expose()
  rootId: string;

  @Expose()
  root: string;

  @Expose()
  transliteration: string;

  @Expose()
  elementId: string;
}

export class Verses {
  @Expose()
  surah: number;

  @Expose()
  verse: number;
}
export class VerseTransform {
  static relationsOneRootResponseDto(
    record: QueryResult<RecordShape>['records'][0],
  ) {
    const tranformed = {
      roots: [
        {
          ...record.get('root').properties,
          elementId: record.get('root').elementId,
        },
      ],
      verses: record.get('relations').map((relation) => ({
        surah: relation.surah.low,
        verse: relation.verse.low,
        ok: true,
      })),
    };
    return plainToClass(RelationsResponseDto, tranformed, {
      excludeExtraneousValues: true,
    });
  }

  static relationsMultipleRootsResponseDto(
    record: QueryResult<RecordShape>['records'][0],
    roots: number[],
  ) {
    const transformed = {
      roots: roots.map((_, rootIndex) => {
        const ordinal = Utils.numberToOrdinal(rootIndex + 1);

        return {
          ...record.get(`${ordinal}Root`).properties,
          elementId: record.get(`${ordinal}Root`).elementId,
        };
      }),
      verses: record.get('relations').map((relation) => ({
        surah: relation.surah.low,
        verse: relation.verse.low,
      })),
    };

    return plainToClass(RelationsResponseDto, transformed, {
      excludeExtraneousValues: true,
    });
  }
}
