import { Module } from '@nestjs/common';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { RootController } from './root.controller';
import { RootRepository } from './root.repository';
import { RootService } from './root.service';

@Module({
  imports: [Neo4jModule],
  controllers: [RootController],
  providers: [RootService, RootRepository],
  exports: [RootService],
})
export class RootModule {}
