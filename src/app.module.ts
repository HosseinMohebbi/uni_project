import { Module } from '@nestjs/common';
import { IndexModules } from './modules/index.module';
import { IndexServices } from './services/index.module';

@Module({
  imports: [IndexModules, IndexServices],
})
export class AppModule {}
