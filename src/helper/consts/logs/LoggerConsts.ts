import chalk from "chalk";
import winston from "winston";

const loggerLevels = {
  crit: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
} as const;
const loggerColours = {
  crit: "bgRed bold white",
  error: "bold red",
  warn: "yellow",
  info: "cyan",
  debug: "magenta bold",
} as const;
const loggerFormat = winston.format.printf(
  ({ level, message, timestamp }) =>
    chalk`{magenta ${timestamp}} [${level}] ${message}`
);
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

export { fileFormat, loggerFormat, loggerColours, loggerLevels };
