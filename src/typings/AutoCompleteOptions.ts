import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
} from "discord.js";
import Bot from "../classes/Bot";

export interface AutoCompleterOptions {
  command: string;
  execute: (opt: {
    ctx: AutocompleteInteraction;
    bot: Bot;
  }) => ApplicationCommandOptionChoice[];
}
