import Command from "../../classes/Command";
import { epherr } from "../../util/strings";
import Canvas from "canvas";
import { MessageAttachment } from "discord.js";
import { simpleEmbed } from "../../util/embed";

const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export default new Command({
  name: "colour",
  description: "Visualise a hex code",
  category: "fun",
  perms: [],
  options: [
    {
      name: "hex",
      description: "Hex code for colour to visualise",
      type: "STRING",
      required: true,
    },
  ],
  async execute({ bot, args, ctx }) {
    const hex = args.getString("hex");
    if (!regex.test(hex) || hex.length < 6)
      return ctx.reply(
        epherr`Hex needs to be a valid hex colour code. See [**:arrow_upper_right: this**](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F) Wikipedia article about colours.`
      );
    const canvas = Canvas.createCanvas(2048, 2048);
    const cctx = canvas.getContext("2d");
    cctx.fillStyle = hex;
    cctx.font = "32px sans-serif";
    cctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new MessageAttachment(canvas.toBuffer(), "colour.png");
    ctx.reply({
      files: [img],
      embeds: [
        simpleEmbed(
          `**[:arrow_upper_right: ${hex}](https://www.thecolorapi.com/id?format=html&hex=${hex.replace(
            "#",
            ""
          )})**`,
          bot
        ),
      ],
    });
  },
});
