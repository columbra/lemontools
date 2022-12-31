const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "boosts",
    description: "Get the boost count and level of the server!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Boost Count:** ${interaction.guild.premiumSubscriptionCount}\n**Boost Level:** ${interaction.guild.premiumTier}`)
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    }
};