import { Body, Controller, Post } from '@nestjs/common';
import { GetContainDto } from './dtos/get-contain.dto';
import { VerseService } from './verse.service';
import { ContainResponseDto } from './dtos/contain-response.dto';

@Controller('/verses')
export class VerseController {
  constructor(private readonly verseService: VerseService) {}

  @Post('/contain')
  async contain(
    @Body()
    roots: GetContainDto,
  ): Promise<ContainResponseDto[]> {
    return this.verseService.getContain(roots.roots);
  }
}
