import Command from "../../classes/Command";
import { inviteRow, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "invite",
  description: "Get various links to do with the bot, including an invite.",
  category: "bot",
  perms: [],

  async execute({ bot, ctx }) {
    ctx.reply({
      components: [inviteRow],
      embeds: [simpleEmbed("Click on the buttons below", bot)],
    });
  },
});
