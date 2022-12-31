const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "update",
    description: "Get the latest update from the bot!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const channel = client.channels.cache.get("1006156347773034577");
        const messages = await channel.messages.fetch({ limit: 1 });
        const message = messages.first();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Update Log")
                    .setDescription(message.content)
                    .setColor("Yellow")
            ],
            ephemeral: false
        })
    }
};