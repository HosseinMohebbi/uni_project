import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [PrismaModule, TagsModule],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
