import { Client } from "discord.js";
import CommandManager from "../modules/command/CommandManager";
import getConfig from "../helper/config/GetConfig";
import Logger from "../modules/logs/Logger";
import EventManager from "../modules/event/EventManager";

export default class Bot extends Client {
  public logger = new Logger();
  public isDev = () => !(process.env.ENVIRONMENT === "production");
  public config = getConfig();

  // Managers
  public CommandManager = new CommandManager(this);
  public EventManager = new EventManager(this);

  constructor() {
    super({
      intents: ["GUILDS", "GUILD_MEMBERS"],
    });
  }
}
