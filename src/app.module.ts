import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RootModule } from './verse/root.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RootModule,
  ],
})
export class AppModule {}
