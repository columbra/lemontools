const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "coinflip",
    description: "Flip a coin",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const coinflip = Math.floor(Math.random() * 2);
        if (coinflip == 0) {
            const headsEmbed = new EmbedBuilder()
                .setTitle('Lemon Tools: Coinflip')
                .setDescription('Heads')
                .setImage('https://media.discordapp.net/attachments/1002079964964855871/1052717856820838501/heads-removebg-preview.png')
                .setColor('Yellow')
            return interaction.reply({
                embeds: [
                    headsEmbed
                ],
                ephemeral: true
            })
        } else {
            const tailsEmbed = new EmbedBuilder()
                .setTitle('Lemon Tools: Coinflip')
                .setDescription('Tails')
                .setImage('https://media.discordapp.net/attachments/1002079964964855871/1052717857181540352/tails-removebg-preview.png')
                .setColor('Yellow')
            return interaction.reply({
                embeds: [
                    tailsEmbed
                ],
                ephemeral: true
            })
        }
    }
}