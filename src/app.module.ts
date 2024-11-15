import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { VerseModule } from './verse/verse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VerseModule,
  ],
})
export class AppModule {}
