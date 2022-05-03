/**
 * @fileoverview Utility struct for error codes
 * @since v3.0.0
 */

export default class ErrorCode {
  public time = new Date();
  constructor(public code: ErrorCodes) {}

  toString() {
    return `${this.time.getTime()}>${this.code}`;
  }
}
export enum ErrorCodes {
  UNKNOWN,
  COMMAND_NOT_FOUND,
  BOT_NO_PERMISSION,
  YOU_NO_PERMISSION,
  YOU_NOT_WORTHY,
  USER_NOT_FOUND,
  GUILD_NOT_FOUND,
  CHANNEL_NOT_FOUND,
  RESOURCE_NOT_FOUND,
}
