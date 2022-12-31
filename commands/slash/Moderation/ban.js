const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban a member from the server",
    type: 1,
    options: [
        {
            name: "member",
            description: "The member you wish to ban",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason for the ban",
            type: 3,
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "BanMembers"
    },
    run: async (client, interaction, config, db) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');

        try {            
            await member.ban(reason);
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`Successfully banned ${member.user.tag}!`)
                                    .setColor('Green')
                            ],
                            ephemeral: false
                        })
            } catch {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`I can't ban ${member.user.tag}!`)
                                    .setColor('Red')
                            ],
                            ephemeral: false
                        })
            }
    }
};