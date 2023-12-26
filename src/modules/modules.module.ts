import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NewslettersModule } from './newsletters/newsletters.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TagsModule,
    NewslettersModule,
    GalleryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class ModulesModule {}
