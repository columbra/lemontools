import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import got from "got/dist/source";
import { Command } from "../../interfaces/Command";
import { PokemonData } from "../../interfaces/Pokemon";

export = class Pokemon extends Command {
  name = "pokemon";
  disabled? = false;
  description = "Search up a Pokemon";
  usage = "<pokemon name>";
  aliases = ["pokedex", "poke"];
  args = true;
  example = "Pikachu";
  cooldown = 1_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setName("pokemon")
        .setDescription("Name of the Pokemon to search up")
        .setRequired(true)
    );
  sudo = false;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const query = ctx.options.getString("pokemon");
    if (!query)
      return ctx.reply(this.eph("You must enter a valid Pokemon name!"));
    let response;
    try {
      response = await got(`https://pokeapi.co/api/v2/pokemon/${query}`);
    } catch (err) {
      return ctx.reply(
        this.eph(
          `Pokemon not found! Please try again, or check your spelling! Your search term was: **${query}**`
        )
      );
    }
    const pokemon: PokemonData = JSON.parse(response.body);
    const moves = pokemon.moves.map((e) => `\`${e.move.name}\``);
    const embed = this.embed(
      {
        title: `${this.capitalise(pokemon.name)} (${pokemon.id})`,
        url: `https://pokemondb.net/pokedex/${pokemon.name.normalize()}`,
        author: {
          name: "PokeApi",
          url: "https://pokeapi.co/",
          iconURL:
            "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png",
        },
        fields: [
          {
            name: "Statistics",
            value: `${pokemon.stats
              .map((e) => `**${e.stat.name}:** ${e.base_stat}`)
              .join("\n")}`,
            inline: true,
          },
          {
            name: "Types",
            value: `${pokemon.types
              .map((e) => `\`${this.capitalise(e.type.name)}\``)
              .join(", ")}`,
            inline: true,
          },
          {
            name: "Appearance",
            value: `**Height:** ${pokemon.height}ft\n**ID:** ${pokemon.id}\n**Weight:** ${pokemon.weight} lbs`,
            inline: true,
          },
          {
            name: "Moves",
            value: `${moves.slice(0, 10).join(", ")} ${
              moves.length > 10 ? `... and ${moves.length - 10} more moves` : ``
            }`,
          },
        ],
      },
      ctx
    );
    ctx.reply({ embeds: [embed] });
  };
};
