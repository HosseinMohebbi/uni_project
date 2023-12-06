import * as bcrypt from 'bcrypt';

export default class HashPasswordUtil {
  public static async HashPassword(password: string, saltOrRounds?: number) {
    const salt = bcrypt.genSaltSync(saltOrRounds || 10);
    return await bcrypt.hash(password, salt);
  }

  public static async VerifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    if (!password || !hash) return false;
    try {
      return bcrypt.compare(password, hash);
    } catch (e) {
      return false;
    }
  }
}
