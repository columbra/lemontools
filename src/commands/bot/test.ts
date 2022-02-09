import Command from "../../classes/Command";

export default new Command({
  name: "testing",
  description: "Placeholder command to test stuff",
  category: "bot",
  perms: [],
  async execute({ bot, args, ctx }) {
    return ctx.reply({
      components: [
        {
          type: "MODAL",
          customId: "test",
          components: [
            {
              type: 4,
              placeholder: "Enter a message",
              required: true,
            },
          ],
        },
      ] as any[],
    });
  },
});
