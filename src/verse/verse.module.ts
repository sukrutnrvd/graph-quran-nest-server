import { Module } from '@nestjs/common';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { VerseController } from './verse.controller';
import { VerseRepository } from './verse.repository';
import { VerseService } from './verse.service';

@Module({
  imports: [Neo4jModule],
  controllers: [VerseController],
  providers: [VerseService, VerseRepository],
  exports: [VerseService],
})
export class VerseModule {}
