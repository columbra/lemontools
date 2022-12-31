const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a member from the server",
    type: 1,
    options: [
        {
            name: "member",
            description: "The member you want to kick",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason for the kick",
            type: 3,
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "KickMembers"
    },
    run: async (client, interaction, config, db) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');

        try {            
            await member.kick(reason);
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`Successfully kicked ${member.user.tag}!`)
                                    .setColor('Green')
                            ],
                            ephemeral: false
                        })
            } catch {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`I can't kick ${member.user.tag}!`)
                                    .setColor('Red')
                            ],
                            ephemeral: false
                        })
            }
    }
};