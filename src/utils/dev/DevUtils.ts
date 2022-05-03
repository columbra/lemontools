/**
 * @fileoverview Development utilities
 * @since v3.0.0
 */

export default class DevUtils {
  static isDev = () => !(process.env.MODE === "prod");
}
