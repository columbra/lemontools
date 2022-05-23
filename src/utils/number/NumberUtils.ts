/**
 * @fileoverview Number utils
 * @since v3.0.0
 */

export default class NumberUtils {
  /**
   * Generate a random number between min and max
   * @param min Minimum number
   * @param max Maximum number
   * @returns Random number between min and max
   */
  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}
