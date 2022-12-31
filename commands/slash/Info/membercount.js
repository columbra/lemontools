const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "membercount",
    description: "Get the member count of the server!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Member Count:** ${interaction.guild.memberCount}`)
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    }
};