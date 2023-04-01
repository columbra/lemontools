// create a command called "sourcecode" that send a link to the source code of the bot

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "sourcecode",
    description: "Get the source code of the bot!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Source Code")
                    .setDescription("Link to the source code of the bot: https://github.com/columbra/lemontools")
                    .setColor("Yellow")
            ],
            ephemeral: false
        })
    }
};
