import Command from "../../classes/Command";
import { embed } from "../../util/embed";

/**
 * Read the comments below on creating a command
 *
 * Btw, if you are on Mac replace Ctrl here with Cmd key.
 */

/**
 * All commands begin in their own file as an "export default new Command({})" (without the "")
 */
export default new Command({
  name: "info", // Name of commmand
  description: "Get info about the bot", // Command description
  perms: [], // Permissions a user needs to run this command. Click into the array on the left and press Ctrl+Space to scroll thru all avaliable options
  sudo: false, // Sudo: This controls whether you must be part of the sudos array (see config.yaml) to run this command. Good for dangerous commands such as eval
  options: [
    {
      name: "page",
      description: "Optional- This does nothing. Just here to demo stuff.",
      type: "STRING", // Many other options avaliable, just delete STRING and press Ctrl+Space to see options
    },
    /**
     * Options can be added in an array format. They appear in Discord the order they are in the array.
     *
     * Create an empty object and press Ctrl+Space to see what you can add to each option. (Psst: Ctrl+Space brings up Intellisense for VSCode)
     */
  ],

  /**
   * Params avaliable:
   * @param bot The bot. This is where you can access stuff about logging, config etc.
   * @param ctx The interaction. This is where you can call methods like reply() and so on
   * @param args The options object: see below for more information
   */
  async execute({ bot, ctx, args }) {
    /**
     * How do I get the options the user has entered? Well thats what args is for!
     *
     * See below:
     */
    args.getString("page"); // This would get the STRING option with the name page (see above)
    /**
     * You must use the correct methods for the correct types. For example, args.getInteger("page") would not work
     * since the page option is a string, not an integer.
     */
    ctx.reply({
      embeds: [
        /**
         * Ooh! Whats that?
         *
         * Its embed()! embed() is a utility function you can use. It is imported "../../util/embed". See the file /util/embed.ts for all embed-related
         * utility functions avaliable.
         */
        embed(
          {
            title: "Setup your bot",
            description:
              "To use this TypeScript framework, you first need to do a little setting up. Please follow the steps below:",
            fields: [
              {
                name: "Step 1. Customising `config.yaml`",
                value:
                  "Create a copy of `config.example.yaml` and rename it `config.yaml`, placing it in the root directory of your bot project. Customise the variables to your liking, then save the file. These changes will be applied once the bot restarts.",
              },
              {
                name: "Step 2. Create a ping command",
                value:
                  "To get used to this framework, begin by creating a simple `ping` command. This command will reply with `pong` when called. To begin, create a new file in the `commands/misc/` directory. Name it something simple, like `pong.ts`. After that, copy this info command into pong. Replace the `ctx.reply` method call with this: ```ts\nctx.reply('pong')```Also replace the description and name of the command to your liking. Your ping command is now setup. ",
              },
              {
                name: "Step 3. Checkout this command",
                value:
                  "Go see this command (`commands/misc/info.ts)`. It will display how to use options, etc. Try messing and tweaking around with it and see what happens! Remember to rebuild and restart the bot when you want to see your changes update in Discord.",
              },
              {
                name: "Notes",
                value:
                  "This software is licensed under the GPLv3 license. Please see LICENSE (in the root directory of this project) for more information",
              },
            ],
            thumbnail: {
              url: "https://www.gnu.org/graphics/gplv3-with-text-136x68.png",
            },
          },
          ctx,
          bot
        ),
      ],
    });
  },
});
