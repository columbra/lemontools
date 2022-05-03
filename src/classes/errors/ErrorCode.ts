/**
 * @fileoverview Utility struct for error codes
 * @since v3.0.0
 */

export default class ErrorCode {
  public time = new Date();
  constructor(public code: ErrorCodes) {}

  [Symbol("toString")]() {
    return `${this.time}>${this.code}`;
  }
}
export enum ErrorCodes {
  UNKNOWN,
  COMMAND_NOT_FOUND,
  BOT_NO_PERMISSION,
  YOU_NO_PERMISSION,
  YOU_NOT_WORTHY,
}
