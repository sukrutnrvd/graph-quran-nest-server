export class Utils {
  static numberToOrdinal(num: number): string {
    const ordinals = [
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
    ];
    if (num < 1 || num > 10) {
      throw new Error('Parameter must be between 1 and 10');
    }
    return ordinals[num - 1];
  }
}
