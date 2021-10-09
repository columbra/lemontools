/** @format */

import winston, { transports, Logger } from "winston";
import {
  Client,
  MessageEmbedOptions,
  Message,
  Intents,
  Collection,
  MessageEmbed,
  Snowflake,
} from "discord.js";
import glob from "glob"
import { promisify } from "util";
import { Config } from "../interfaces/Config";
