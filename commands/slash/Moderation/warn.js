const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "warn",
    description: "Warn a member from the server",
    type: 1,
    options: [
        {
            name: "member",
            description: "The member you wish to warn",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason for the warn",
            type: 3,
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "ManageMessages"
    },
    run: async (client, interaction, config, db) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');

        try {            
            await member.send(`You have been warned in ${interaction.guild.name} for ${reason}`);
            db.collection('warns').insertOne({
                guildID: interaction.guild.id,
                userID: member.user.id,
                reason: reason
            })
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`Successfully warned ${member.user.tag}!`)
                                    .setColor('Green')
                            ],
                            ephemeral: false
                        })
            } catch {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Successfully warned ${member.user.tag}!`)
                            .setColor('Green')
                    ],
                    ephemeral: false
                })
            }
    }
};