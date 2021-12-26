import * as dotenv from "./lib/dotenv";
import path from "path";
import Bot from "./classes/Bot";

const { parsed } = dotenv.config({
  path: path.join(__dirname, `../.env`),
});
for (const key in parsed) {
  if (Object.prototype.hasOwnProperty.call(parsed, key)) {
    const element = parsed[key];
    process.env[key] = element;
  }
}

if (["dev", "debug"].includes(process.env.ENVIRONMENT)) {
  const { parsed } = dotenv.config({
    path: path.join(__dirname, `../.env.dev`),
  });
  for (const key in parsed) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      const element = parsed[key];
      process.env[key] = element;
    }
  }
}

export const bot = new Bot();

bot.start();
