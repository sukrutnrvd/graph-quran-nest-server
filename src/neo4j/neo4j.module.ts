import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import neo4j from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('NEO4J_HOST');
        const username = configService.get<string>('NEO4J_USERNAME');
        const password = configService.get<string>('NEO4J_PASSWORD');
        const driver = neo4j.driver(host, neo4j.auth.basic(username, password));
        return driver;
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
