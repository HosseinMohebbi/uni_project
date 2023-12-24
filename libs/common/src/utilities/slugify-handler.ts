import slugify from 'slugify';

export class SlugifyHandler {
  public static create(
    str: string,
    options?: {
      replacement?: string;
      remove?: RegExp;
      lower?: boolean;
      strict?: boolean;
      locale?: string;
      trim?: boolean;
    },
  ) {
    return slugify(str, options);
  }

  public static persianSlug(str: string) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    //persian support
    str = str
      .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, '')
      // Collapse whitespace and replace by -
      .replace(/\s+/g, '-')
      // Collapse dashes
      .replace(/-+/g, '-');
    str = str;
    return str;
  }
}
