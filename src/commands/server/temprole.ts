import { GuildMember } from "discord.js";
import Command from "../../classes/Command";
import ms from "../../lib/ms";
import TempRole from "../../schema/TempRole";
import type { TempRole as TempRoleType } from "../../schema/TempRole";
import { embed, epherrf, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "temprole",
  description: "Grant a user a temporary role.",
  category: "category",
  perms: ["MANAGE_ROLES"],
  options: [
    {
      name: "role",
      description: "The role to grant.",
      required: true,
      type: "ROLE",
    },
    {
      name: "user",
      description: "The user to grant the role to.",
      required: true,
      type: "USER",
    },
    {
      name: "duration",
      description: "The duration of the role.",
      required: true,
      type: "STRING",
    },
  ],
  async execute({ bot, args, ctx }) {
    await ctx.deferReply();
    const role = args.getRole("role");
    const user = args.getMember("user");
    const duration = await ms(args.getString("duration")).catch(() => {
      ctx.editReply(
        epherrf(
          "You specified an invalid duration! Please specify a valid duration, such as `2h` (2 hours) or `1d` (1 day)"
        )
      );
    });
    if (!duration) return;
    const expiry = new Date(Date.now() + duration);
    if (!(user instanceof GuildMember))
      return ctx.editReply(epherrf("You specified an invalid user!"));
    user.roles.add(role.id).then((m) => {
      const tempRole = new TempRole({
        byId: ctx.user.id,
        expiry,
        roleId: role.id,
        serverId: ctx.guild.id,
        userId: user.id,
      } as TempRoleType);
      tempRole
        .save()
        .then(() => {
          ctx.editReply({
            embeds: [
              simpleEmbed(
                `Successfully gave ${user} (\`${user.id}\`) ${role} for ${ms(
                  duration
                )} (Expires <t:${Math.round(expiry.getTime() / 1000)}:R>)`,
                bot
              ),
            ],
          });
        })
        .catch(() => {
          ctx.editReply(epherrf("There was an error trying to save the role!"));
        });
    });
  },
});
