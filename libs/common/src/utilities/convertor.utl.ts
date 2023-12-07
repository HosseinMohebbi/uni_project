import moment from 'jalali-moment';

export class ConvertorUtl {
  public static JsonBigintString(obj: Record<string, any>) {
    const json = JSON.stringify(obj, (_, v) => {
      return typeof v == 'bigint' ? String(v) : v;
    });
    return JSON.parse(json);
  }

  public static BigintNumber(value: bigint | number) {
    if (typeof value == 'bigint') return Number.parseInt(value.toString(), 10);
    else return value;
  }

  public static RialToToman(price: number | string, separator?: boolean) {
    price = Number(Number(price) / 10);
    if (separator) price = price.toLocaleString();
    return price;
  }

  public static ConvertUnixTimeToJalaliDate(unixTime: number): string {
    return moment.unix(unixTime).format('jYYYY/jMM/jDD');
  }

  public static ConvertDateTimeToJalaliDate(datetime: string | Date): string {
    const momentDate = moment(datetime, 'YYYY-MM-DD HH:mm:ss.SSS');
    return momentDate.locale('fa').format('jYYYY/jMM/jDD HH:mm:ss');
  }

  public static checkDateIsPast(date: Date | string): boolean {
    const currentDate = new Date();
    return new Date(date) >= currentDate;
  }
}
