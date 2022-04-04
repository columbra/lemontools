import winston, { transports } from "winston";
import * as LoggerConsts from "../../helper/consts/logs/LoggerConsts";

const findKey = (obj, val) => {
  const res = {};
  Object.keys(obj).map((key) => {
    res[obj[key]] = key;
  });
  // if the value is not present in the object
  // return false
  return res[val] || false;
};

export default class Logger {
  private _create = Date.now();
  private _winston = winston.createLogger({
    levels: LoggerConsts.loggerLevels,
    transports: [
      new transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ colors: LoggerConsts.loggerColours }),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          LoggerConsts.loggerFormat
        ),
        level: process.env.ENVIRONMENT === "debug" ? "debug" : "info",
      }),
      new transports.File({
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          LoggerConsts.fileFormat
        ),
        filename: `log-lemontools-${Date.now()}.log`,
      }),
    ],
  });
  constructor() {
    this.info(
      `Logger successfully started. Took ${Date.now() - this._create}ms`
    );
  }

  private _log(level: 0 | 1 | 2 | 3 | 4, str: string) {
    const key = findKey(LoggerConsts.loggerLevels, level);
    return this._winston.log(key, str);
  }
  public crit(str: string) {
    return this._log(0, str);
  }
  public error(str: string) {
    return this._log(1, str);
  }
  public warn(str: string) {
    return this._log(2, str);
  }
  public info(str: string) {
    return this._log(3, str);
  }
  public debug(str: string) {
    return this._log(4, str);
  }
}
