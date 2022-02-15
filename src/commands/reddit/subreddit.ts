import { MessageActionRow, MessageButton, TextChannel } from "discord.js";
import Command from "../../classes/Command";
import { SubredditPosts } from "../../typings/reddit/subreddit";
import { embed, errorMessage } from "../../util/embed";
import { LemonEmojis } from "../../util/emoji";
import { rnd } from "../../util/number";
import { getJSON } from "../../util/web";

export default new Command({
  name: "subreddit",
  description: "Fetch a random hot post from a subreddit",
  category: "reddit",
  perms: [],
  usage: "<subreddit>",
  example: "facepalm",

  options: [
    {
      name: "subreddit",
      description: "Subreddit to fetch post from (no r/)",
      type: "STRING",
      required: true,
    },
  ],

  async execute({ bot, ctx, args }) {
    await ctx.deferReply();
    const query = args.getString("subreddit").toLowerCase();
    const isNSFW = (ctx.channel as TextChannel).nsfw;
    const url = `https://reddit.com/r/${query}/hot.json`; // Missing data.after = subreddit does not exist
    const json = await getJSON<SubredditPosts>(url).catch((err) => {
      bot.logger.warn(`Error whilst fetching subreddit ${query}, ${err}`);
      ctx.editReply(
        errorMessage(
          `There was an error trying to fetch a post from that subreddit. This might be because the subreddit does not exist!`
        )
      );
      return;
    });
    if (!json)
      return ctx.editReply(
        errorMessage(
          `There was an error trying to fetch a post from that subreddit. This might be because the subreddit does not exist!`
        )
      );
    const { data } = json.data;
    if (!data.after)
      return ctx.editReply(
        errorMessage(
          `Subreddit \`${query}\` does not exist. ${
            query.includes("r/") ? "*r/ is not required*" : ""
          }`
        )
      );
    const { children: posts } = data;
    const { data: post } = posts.filter((p) =>
      p.data.over_18 ? isNSFW : true
    )[rnd(0, posts.length)] || { data: null }; // Remove over_18 (nsfw) posts then randomly select a post
    if (!post)
      return ctx.editReply(
        errorMessage(
          "Whoops! There are no posts avaliable to show right now. \n\n*(PSST: NSFW posts cannot be shown outside of NSFW channels due to Discord TOS. Ask your server admins to add a NSFW channel if you dont have one already.)*"
        )
      );
    const embeds = [
      embed(
        {
          author: {
            name: post.author,
            url: `https://reddit.com/u/${post.author}`,
          },
          title: post.title,
          url: post.url_overridden_by_dest,
          description: post.selftext,
          image: {
            url: post.url.includes("v.reddit") ? null : post.url,
          },
          fields: [
            {
              name: `Post Information`,
              value: `${LemonEmojis.Karma} ${post.ups}
              ${LemonEmojis.Gilds} ${post.all_awardings.length}`,
            },
          ],
        },
        ctx,
        bot
      ),
    ];
    const components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel(`Go to /r/${query}`)
          .setURL(`https://reddit.com/r/${query}/hot`)
          .setStyle("LINK"),
      ]),
    ];
    ctx.editReply({
      embeds,
      components,
    });
  },
});
