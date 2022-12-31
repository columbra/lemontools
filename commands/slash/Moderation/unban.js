const { EmbedBuilder, Client, GatewayIntentBits, Message } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

module.exports = {
    name: "unban",
    description: "Unbans a user from the guild",
    type: 1,
    options: [
        {
            name: "user",
            description: "The user you want to unban",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason for the unban",
            type: 3,
            required: false
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "BanMembers"
    },
    run: async (client, interaction, config, db) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!user) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setDescription('Please provide a user to unban!')
                        .setColor('RED')
                ],
                ephemeral: true
            })
        }

        message.guild.members.unban(id, reason);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Success!')
                    .setDescription(`Successfully unbanned ${user.tag}!`)
                    .setColor('GREEN')
            ],
            ephemeral: true
        })
    }
};