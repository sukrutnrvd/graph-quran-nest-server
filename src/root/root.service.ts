import { Injectable } from '@nestjs/common';
import { RootRepository } from './root.repository';
import { VerseTransform } from './dtos';

@Injectable()
export class RootService {
  constructor(private readonly rootRepository: RootRepository) {}

  async getRelations(roots: number[]) {
    if (roots.length === 1) {
      const result = await this.rootRepository.getRelationsForOneRoot(
        roots[0].toString(),
      );
      return VerseTransform.relationsOneRootResponseDto(result.records[0]);
    }

    const result =
      await this.rootRepository.getRelationsForMultipleRoots(roots);

    return VerseTransform.relationsMultipleRootsResponseDto(
      result.records[0],
      roots,
    );
  }

  async getFrequency(root: number) {
    const result = await this.rootRepository.getFrequency(root.toString());
    return result.records.map(VerseTransform.frequencyResponseDto);
  }
}
