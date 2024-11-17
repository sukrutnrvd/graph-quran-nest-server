import { Expose, plainToClass } from 'class-transformer';
import { QueryResult, RecordShape } from 'neo4j-driver';

import { FrequencyResponseDto } from './frequency-response.dto';
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
    const tranformed: RelationsResponseDto = {
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
    const transformed: RelationsResponseDto = {
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

  static frequencyResponseDto(record: QueryResult<RecordShape>['records'][0]) {
    const transformed: FrequencyResponseDto = {
      root: {
        ...record.get('root').properties,
        elementId: record.get('root').elementId,
      },
      verses: record
        .get('verses')
        .map((relation) => ({
          id: relation.elementId,
          surah: relation.properties.surah.low,
          verse: relation.properties.verse.low,
        }))
        // todo: this should be done in the query
        .sort((a, b) => a.surah - b.surah || a.verse - b.verse),
      count: record.get('_count').low,
    };

    return plainToClass(FrequencyResponseDto, transformed, {
      excludeExtraneousValues: true,
    });
  }
}
