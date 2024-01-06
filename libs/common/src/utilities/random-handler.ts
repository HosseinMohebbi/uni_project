import { generate, GenerateOptions } from 'randomstring';
import * as crypto from 'crypto';

export default class RandomHandler {
  public static RandomString(options?: GenerateOptions) {
    return generate(options);
  }

  public static RandomNumeric(length?: number) {
    return generate({
      length: length || 6,
      charset: 'numeric',
    });
  }

  public static RandomNumber(length = 6) {
    return Math.floor(Math.random() * 10 ** length);
  }

  public static UniqRandomString(
    length?: number,
    lowerCase?: boolean,
    characters?: string,
  ) {
    let random = this.RandomString({
      length: 5,
      charset: characters || 'alphabetic',
    });
    for (let i = 0; i < (length * 2 || 50); i++) {
      random =
        random +
        this.RandomString({ length: 2, charset: characters || 'alphabetic' });
    }
    if (length)
      random = lowerCase
        ? random.substring(5, length + 5).toLowerCase()
        : random.substring(5, length + 5);
    return random;
  }

  public static CryptoRandomString(length?: number) {
    return crypto.randomBytes(length ?? 20).toString('hex');
  }

  public static RandomStringFromUser(userUid: string) {
    return generate({
      length: 20,
      charset: userUid,
    });
  }
}
