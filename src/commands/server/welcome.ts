import { MessageEmbedOptions } from "discord.js";
import Command from "../../classes/Command";
import Welcome, { WelcomeInterface } from "../../schema/Welcome";
import { epherrf, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "welcome",
  description: "Manage member welcome DMs",
  category: "server",
  perms: ["MANAGE_GUILD"],
  options: [
    {
      name: "edit",
      description: "Edit your server's welcome configuration",
      type: "SUB_COMMAND",
      options: [
        {
          name: "title",
          description: "Title of embed to send to user",
          type: "STRING",
          required: true,
        },
        {
          name: "description",
          description: "Description of embed",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "disable",
      description: "Delete and disable welcome DMs",
      type: "SUB_COMMAND",
    },
    {
      name: "whodid",
      description: "Find out who changed the welcome DMs last",
      type: "SUB_COMMAND",
    },
    {
      name: "preview",
      description: "Preview the welcome DM",
      type: "SUB_COMMAND",
    },
  ],
  async execute({ bot, args, ctx }) {
    if (!ctx.guildId)
      return ctx.reply(
        epherrf("You need to be in a server to execute this command")
      );
    const subcommand = args.getSubcommand(true);
    switch (subcommand) {
      case "disable":
        Welcome.deleteOne({ serverId: ctx.guildId }).then((d) => {
          if (d.deletedCount > 1)
            bot.logger.crit(
              `!!! USER MANAGED TO DELETE MORE THAN ONE DOCUMENT IN WELCOME.TS !!!`
            );
          if (d.deletedCount === 0)
            return ctx.reply(
              epherrf(
                `Your server does not have welcome DMs set up, so we can't delete them!`
              )
            );
          ctx.reply({
            embeds: [simpleEmbed(`Successfully deleted!`, bot)],
          });
        });
        break;
      case "edit":
        const title = args.getString("title");
        const description = args.getString("description");
        const embed: MessageEmbedOptions = {
          title,
          description,
          footer: {
            text: `Powered by ${bot.config.bot.name}. This bot is providing a service, to disable further DMs, please use the /block command to configure blocking.`,
            iconURL: ctx.guild.iconURL(),
          },
        };
        let welcome: {
          save: () => void;
          embed: MessageEmbedOptions;
          lastChagesBy: string;
        };
        welcome = await Welcome.findOne({ serverId: ctx.guildId }).exec();
        if (!welcome) {
          welcome = new Welcome({
            embed,
            serverId: ctx.guildId,
            lastChangesBy: ctx.user.id,
          });
          welcome.save();
        } else {
          welcome.embed = embed;
          welcome.lastChagesBy = ctx.user.id;
          welcome.save();
        }
        ctx.reply({
          embeds: [
            simpleEmbed(
              `Successfully saved welcome DM. See below for a preview`,
              bot
            ),
            embed,
          ],
        });
        break;
      case "whodid":
        const document: WelcomeInterface = await Welcome.findOne({
          serverId: ctx.guildId,
        }).exec();
        if (!document)
          return ctx.reply(
            epherrf(
              `Your server doesn't have welcome DMs enabled. Use \`/welcome edit\` to add one`
            )
          );
        ctx.reply({
          embeds: [
            simpleEmbed(
              `The last change was made by <@${document.lastChangesBy}> ID: \`${document.lastChangesBy}\``,
              bot
            ),
          ],
        });
        break;
      case "preview":
        const doc: WelcomeInterface = await Welcome.findOne({
          serverId: ctx.guildId,
        }).exec();
        if (!doc)
          return ctx.reply(
            epherrf(
              `Your server doesn't have welcome DMs enabled. Use \`/welcome edit\` to add one`
            )
          );
        ctx.reply({
          content: "Your embed should look like this:",
          embeds: [doc.embed],
        });
        break;
      default:
        ctx.reply(
          epherrf(
            `Whoops! Something went wrong. Please join our support server or try again later.`
          )
        );
        break;
    }
  },
});
