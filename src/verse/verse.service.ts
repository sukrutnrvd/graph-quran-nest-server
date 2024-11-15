import { Injectable } from '@nestjs/common';
import { VerseRepository } from './verse.repository';
import { VerseTransform } from './dtos';

@Injectable()
export class VerseService {
  constructor(private readonly verseRepository: VerseRepository) {}

  async getContain(roots: number[]) {
    if (roots.length === 1) {
      const result = await this.verseRepository.getContainForOneRoot(
        roots[0].toString(),
      );
      return result.records.map(VerseTransform.containOneRootResponseDto);
    }

    const result = await this.verseRepository.getContainForMultipleRoots(roots);
    return result.records.map((record) =>
      VerseTransform.containMultipleRootsResponseDto(record, roots),
    );
  }
}
