const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Replies with the bots latency!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("My current latency is: " + client.ws.ping + "ms!")
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    },
};
