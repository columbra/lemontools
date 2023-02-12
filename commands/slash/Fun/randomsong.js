const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "randomsong",
    description: "Pulls a random song from the top 100 songs on Spotify",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const fetch = require('node-fetch');
        const res = await fetch('https://spotifycharts.com/regional/global/weekly/latest/download');
        const text = await res.text();
        const lines = text.split('\n');
        const songs = lines.map(line => line.split(',')[1]).slice(1);
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Random Song')
                    .setDescription(randomSong)
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    }
};