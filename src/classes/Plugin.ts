import Bot from "./Bot";

type PluginFunction<T = any> = (bot: Bot) => Promise<T>;

// This function is repeated every x seconds, and is used to run some plugins.
type PluginRepeatableFunction<T = any, S = any> = (
  state: Record<string, any>
) => Promise<T>;

interface PluginOptions {
  ready?: boolean; // If the plugin is to be used after the bot is ready
  initial?: boolean; // If the plugin is loaded on startup. (Mutually exclusive with ready)
  repeat?: number; // How often the plugin should repeat. (In milliseconds)
}

export default class Plugin<S = any, T = any> {
  // Object to keep state for the plugin
  private state: Record<string, S> = {};

  constructor(
    execute: PluginFunction<T>,
    repeat: PluginRepeatableFunction<T, S>,
    opt: PluginOptions
  );
  constructor(
    public execute: PluginFunction,
    public repeat?: PluginRepeatableFunction,
    public readonly opt: PluginOptions = {}
  ) {
    if (opt.ready && opt.initial) {
      throw new Error("Plugin options cannot be both ready and initial");
    }
    setInterval(() => {
      if (this.repeat) {
        this.repeat(this.state).catch(console.error);
      }
      // If opt.repeat is not specified, it will default to 60_000, which is 60 seconds.
    }, opt.repeat || 60_000);
  }
}
