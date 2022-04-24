import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
  CacheType,
} from "discord.js";
import Bot from "./Bot";

export default class AutoCompleter {
  constructor(
    public readonly command: string,
    public readonly execute: AutoCompleterExecute
  ) {}
}

type AutoCompleterExecute = (opt: {
  ctx: AutocompleteInteraction<CacheType>;
  bot: Bot;
}) => ApplicationCommandOptionChoice[];
