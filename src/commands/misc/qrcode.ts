import Command from "../../classes/Command";
import { embed, errorMessage } from "../../util/embed";

const regex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; // Check url validity

export default new Command({
  name: "qr",
  description: "Create a QR code for a URL or webpage",
  category: "misc",
  perms: [],
  usage: "<url>",
  example: "google.com",
  options: [
    {
      name: "url",
      description: "URL to create QR code for",
      type: "STRING",
      required: true,
    },
  ],

  async execute({ args, ctx, bot }) {
    const url = args.getString("url");
    if (!url) return ctx.reply(errorMessage("You must provide a url"));
    if (!regex.test(url))
      return ctx.reply(errorMessage("You must provide a valid URL"));
    ctx.reply({
      embeds: [
        embed(
          {
            title: `QR Code`,
            description: `The image may take up to 10 seconds to load. Original URL: ${url}`,
            image: {
              url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`,
            },
          },
          ctx,
          bot
        ),
      ],
    });
  },
});
