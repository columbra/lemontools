import Command from "../../classes/Command";
import crypto from "crypto";
import { simpleEmbed } from "../../util/embed";

export default new Command({
  name: "hash",
  description: "Hash a string using MD5, SHA1, SHA-256",
  category: "convert",
  perms: [],
  options: [
    {
      name: "hash",
      description: "Hash algorithm to use",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "md5",
          value: "md5",
        },
        {
          name: "sha1",
          value: "sha1",
        },
        {
          name: "sha256",
          value: "sha256",
        },
        {
          name: "sha512",
          value: "sha512",
        }
      ],
    },
    {
      name: "string",
      description: "String to hash",
      type: "STRING",
      required: true,
    },
  ],
  async execute({ bot, args, ctx }) {
    const algorithm = args.getString("hash");
    const string = args.getString("string");

    const hashed = crypto.createHash(algorithm).update(string).digest("hex");
    ctx.reply({
      embeds: [
        simpleEmbed(`Original: \`${string}\`\nHashed: \`${hashed}\`\nAlgorithm: ${algorithm}`, bot),
      ],
    });
  },
});
