import { ApplicationCommandOptionChoice, AutocompleteInteraction, CacheType } from "discord.js";
import { AutoCompleterOptions } from "../typings/AutoCompleteOptions";
import Bot from "./Bot";

export default class AutoCompleter implements AutoCompleterOptions {
  command: string;
  execute: (opt: { ctx: AutocompleteInteraction<CacheType>; bot: Bot; }) => ApplicationCommandOptionChoice[];
  constructor(opt: AutoCompleterOptions) {
    Object.assign(this, opt);
  }
}
