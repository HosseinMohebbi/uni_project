import { Module } from '@nestjs/common';
import { ConfigModule as ClientConfigModule } from '@nestjs/config';
import { configSchemaValidation } from './schemas';

@Module({
  imports: [
    ClientConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: configSchemaValidation,
    }),
  ],
})
export class ConfigModule {}
