import { Client } from "discord.js";
import CommandManager from "../modules/command/CommandManager";
import getConfig from "../helper/config/GetConfig";
import Logger from "../modules/logs/Logger";
import EventManager from "../modules/event/EventManager";
import makeCache from "../helper/config/MakeCache";
import PluginManager from "../modules/plugin/PluginManager";
import ListenerManager from "../modules/web/Listener";
import MonitoringManager from "../modules/logs/MonitoringManager";
import PreCloseCleanupManager from "../modules/cleanup/PreCloseCleanupManager";

export default class Bot extends Client {
  public logger = new Logger();
  public isDev = () => !(process.env.ENVIRONMENT === "production");
  public config = getConfig();

  // Managers
  public CommandManager = new CommandManager(this);
  public EventManager = new EventManager(this);
  public PluginManager = new PluginManager(this);
  public ListenderManager = new ListenerManager(this);
  public MonitoringManager = new MonitoringManager(this);
  public PreCloseCleanupManager = new PreCloseCleanupManager(this)

  constructor() {
    super({
      intents: ["GUILDS", "GUILD_MEMBERS"],
      makeCache,
    });

    if (this.isDev()) this.logger.warn(`Running in developer or debug mode`);
    this.start();
  }

  private start() {
    const _create = Date.now();
    this.login(process.env.BOT_TOKEN).then(() => {
      this.logger.info(
        `Successfully logged in as ${this.user.tag}. Took ${
          Date.now() - _create
        }ms`
      );
    });
  }
}
