const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "minesweeper",
    description: "Play minesweeper!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const minesweeper = require('discord.js-minesweeper');
        const minesweeperGame = new minesweeper({ rows: 10, columns: 10, mines: 10 });
        const minesweeperEmbed = new EmbedBuilder()
            .setTitle('Lemon Tools: Minesweeper')
            .setDescription(minesweeperGame.start())
            .setColor('Yellow')
        return interaction.reply({
            embeds: [
                minesweeperEmbed
            ],
            ephemeral: false
        })
    }
}