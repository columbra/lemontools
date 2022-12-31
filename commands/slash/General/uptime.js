const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "uptime",
    description: "Get the bots uptime!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s`)
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    }
};