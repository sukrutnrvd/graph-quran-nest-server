import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetRelationsDto } from './dtos/get-relations.dto';
import { RootService } from './root.service';
import { RelationsResponseDto } from './dtos/relations-response.dto';
import { GetFrequencyDto } from './dtos/get-frequency.dto';

@Controller('/root')
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Post('/relations')
  @HttpCode(200)
  async relations(
    @Body()
    body: GetRelationsDto,
  ): Promise<RelationsResponseDto> {
    return this.rootService.getRelations(body.roots);
  }

  @Post('/frequency')
  @HttpCode(200)
  async frequency(
    @Body()
    body: GetFrequencyDto,
  ) {
    return this.rootService.getFrequency(body.root);
  }
}
