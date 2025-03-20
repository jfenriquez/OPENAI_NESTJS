import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { config } from 'process';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GptModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
