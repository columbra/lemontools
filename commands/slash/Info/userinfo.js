const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "userinfo",
    description: "Get information about a user",
    type: 1,
    options: [
        {
            name: "user",
            description: "The user you want to get information about",
            type: 6,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const user = interaction.options.getUser('user');
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(user.username)
                    .setDescription(`**User ID:** ${user.id} \n **User Creation Date:** ${user.createdAt} \n **User Bot:** ${user.bot}`)
                    .setColor('Yellow')
                    .setThumbnail(user.avatarURL())
            ],
            ephemeral: false
        })
    }
};