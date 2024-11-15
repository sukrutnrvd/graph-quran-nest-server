import { Expose, plainToClass } from 'class-transformer';
import { QueryResult, RecordShape } from 'neo4j-driver';

import { ContainResponseDto } from './contain-response.dto';
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

export class VerseTransform {
  static containOneRootResponseDto(
    record: QueryResult<RecordShape>['records'][0],
  ) {
    const tranformed = {
      roots: [
        {
          ...record.get('root').properties,
          elementId: record.get('root').elementId,
        },
      ],
      surah: record.get('surah').low,
      verse: record.get('verse').low,
    };
    return plainToClass(ContainResponseDto, tranformed);
  }

  static containMultipleRootsResponseDto(
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
      surah: record.get('properties(r1)').surah.low,
      verse: record.get('properties(r1)').verse.low,
    };
    return plainToClass(ContainResponseDto, transformed);
  }
}
