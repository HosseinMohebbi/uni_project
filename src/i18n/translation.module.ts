import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'fa',
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      fallbacks: {
        'en-*': 'en',
        'fa-*': 'fa',
      },
      loaderOptions: {
        path: path.join(__dirname, '.'),
        watch: true,
        includeSubfolders: true,
      },
    }),
  ],
})
export class TranslationModule {}
