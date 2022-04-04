import Bot from "./NewBot";

export type LemonPluginFunction = (bot: Bot) => Promise<unknown>;
export interface LemonPluginOptions {
  ready: boolean;
}

export default class LemonPlugin {
  constructor(
    public readonly name: string,
    public readonly func: LemonPluginFunction,
    public readonly options?: LemonPluginOptions
  ) {}
}
