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
}
