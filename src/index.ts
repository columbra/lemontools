/**
 * @license GPL-3.0-or-later See LICENSE file in folder root
 * Lemon Tools is an open-sourced, completely free-to-use Discord Bot.
   Copyright (C) 2021 Windows95

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @see [GitHub]{@linkcode https://cooljim.github.io/lemontools/}
 */
import * as File from "../config.json";
import { Bot } from "./client/Client";
import { Config } from "./interfaces/Config";

String.prototype.eph = function (this: string) {
  return {
    ephemeral: true,
    content: this,
  };
};

const bot = new Bot();
bot.start(File as Config);

/**
 * Error handling for uncaughtExceptions and unhandledRejections
 */
process.on("uncaughtException", (err) => {
  bot.logger.error(`An error occured! Error:\n${err.message}.\n\n${err.stack}`);
});

process.on("unhandledRejection", (err) => {
  bot.logger.error(`A Promise rejection occured!`);
});
