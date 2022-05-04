/**
 * @fileoverview Utilities for working with strings
 * @since v3.0.0
 */

export default class StringUtils {
  static capitialise(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static reverse(str: string) {
    return str.split("").reverse().join("");
  }

  static remove(str: string, remove: string) {
    return str.replace(remove, "");
  }
}
