const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "serverinfo",
    description: "Get information about the server",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(interaction.guild.name)
                    .setDescription(`**Server ID:** ${interaction.guild.id} \n **Server Owner ID:** ${interaction.guild.ownerId} \n **Server Member Count:** ${interaction.guild.memberCount} \n  **Server Creation Date:** ${interaction.guild.createdAt}`)
                    .setColor('Yellow')
                    .setThumbnail(interaction.guild.iconURL())
            ],
            ephemeral: false
        })
    }
}

