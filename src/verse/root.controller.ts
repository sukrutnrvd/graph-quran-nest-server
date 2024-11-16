import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetRelationsDto } from './dtos/get-relations.dto';
import { RootService } from './root.service';
import { RelationsResponseDto } from './dtos/relations-response.dto';

@Controller('/root')
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Post('/relations')
  @HttpCode(200)
  async relations(
    @Body()
    roots: GetRelationsDto,
  ): Promise<RelationsResponseDto> {
    return this.rootService.getRelations(roots.roots);
  }
}
