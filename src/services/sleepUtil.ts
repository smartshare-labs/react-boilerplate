export default class SleepUtil {
  static async SleepAsync(ms = 0): Promise<unknown> {
    return new Promise(r => setTimeout(r, ms));
  }
}
