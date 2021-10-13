import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import request from "request";
import { RedditPost } from "../../interfaces/Reddit";

export = class ShowerThought extends Command {
  name = "showerthought";
  disabled? = false;
  description = "Fetch some showerthoughts from r/showerthoughts";
  usage = "";
  aliases = ["r/showerthoughts", "st"];
  args = false;
  example = "";
  cooldown = 3_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const posts: RedditPost[] = [];
    await interaction.deferReply();
    const url = `https://reddit.com/r/showerthoughts/hot.json`;
    const options = { json: true };

    request(url, options, (err, res, body) => {
      if (err) return interaction.editReply("Something went wrong");
      const data = body.data.children;
      data.forEach((e: any) => {
        const data = e.data as RedditPost;
        data.over_18 ? null : posts.push(data);
      });
      const post = posts[Math.ceil(Math.random() * posts.length)];
      const embed = this.embed(
        {
          title: post.title,
          url: post.url,
          author: {
            name: `${post.author} • on ${post.subreddit_name_prefixed}`,
            url: `https://reddit.com/u/${post.author}`,
          },
          description: `**Upvotes:** ${
            post.ups
          }\n**Downvotes:** ${this.calcNumberFromRatio(
            post.ups,
            post.upvote_ratio
          )}\n**Percent upvoted** ${this.percentFromDecimal(
            post.upvote_ratio
          )}\n\n**Posted at:** <t:${post.created_utc}:F> (<t:${
            post.created_utc
          }:R>)`,
        },
        interaction
      );
      interaction.editReply({ embeds: [embed] });
    });
  };
};
