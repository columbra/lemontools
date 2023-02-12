// create a command that randomly generates a name for a person using ai and returns it as an embed

const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ainame",
    description: "Generates a random name using AI",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const fetch = require('node-fetch');
        const res = await fetch('https://api.agify.io/?name=');
        const text = await res.text();
        const lines = text.split('\n');
        const name = lines.map(line => line.split(',')[1]).slice(1);
        const randomName = name[Math.floor(Math.random() * name.length)];
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('AI Generated Name')
                    .setDescription(randomName)
                    .setColor('Yellow')
            ],
            ephemeral: false
        })
    }
};