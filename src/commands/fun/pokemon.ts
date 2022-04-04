import Command from "../../classes/Command";
import { embed } from "../../helper/util/embed";
import { capitalise, epherr } from "../../helper/util/strings";
import { getJSON } from "../../helper/util/web";

export default new Command({
  name: "pokemon",
  description: "Search up a Pokemon using the PokeAPI",
  category: "fun",
  perms: [],
  options: [
    {
      name: "pokemon",
      description: "Pokemon to search up",
      type: "STRING",
      required: true,
    },
  ],
  example: "pikachu",
  async execute({ bot, args, ctx }) {
    await ctx.deferReply();
    const pokemon = args.getString("pokemon").toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    let data = bot.cache.get(url)?.data;
    if (!data) {
      data = (await getJSON<any>(url).catch(() => null))?.data;
      if (!data)
        return ctx.editReply(
          epherr`No Pokemon could be found. Please check your spelling!`
        );
      bot.cache.set(url, data, Infinity); // No need to remove, it is static anyways
    }
    const em = embed(
      {
        title: `Information about ${capitalise(data.name)}`,
        description: `\`\`\`yaml\nID: ${data.id}\nBase Experience: ${
          data.base_experience
        }\nDefault: ${data.is_default ? "yes" : "no"}\nMoves: ${
          data.moves.length
        }\`\`\``,
        fields: [
          {
            name: "Height",
            value: `${data.height}ft`,
            inline: true,
          },
          {
            name: "Weight",
            value: `${data.weight} pounds`,
            inline: true,
          },
        ],
        thumbnail: {
          url: data.sprites.front_default,
        },
      },
      ctx,
      bot
    );
    ctx.editReply({
      embeds: [em],
    });
  },
});
