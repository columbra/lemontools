/**
 * @fileoverview Logging manager
 * @since v3.0.0
 */

import winston = require("winston");
import Manager from "../../classes/manager/Manager";
import config from "../../config";
import type LemonTools from "../../LemonTools";

export default class Logger extends Manager {
  winston = winston.createLogger({
    levels: config.bot.logging.config.levels,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({
            colors: config.bot.logging.config.colors,
          }),
          winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss.SSS [TZ] ZZ",
          }),
          winston.format.printf((info) => `[${info.level}] ${info.message}`)
        ),
      }),
    ],
  });

  constructor(lemontools: LemonTools) {
    super(lemontools, "Logger");
  }

  log(
    level: keyof typeof config.bot.logging.config.levels,
    tag: string,
    content: string
  ) {
    winston.log(level, `< ${tag} > ${content}`);
  }
}
