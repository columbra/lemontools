const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "minecraft",
    description: "Get information about a minecraft player",
    type: 1,
    options: [
        {
            name: "player",
            description: "The player you want to get information about",
            type: 3,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const player = interaction.options.getString('player');
        const fetch = require('node-fetch');
        const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`);
        const json = await res.json();
        const uuid = json.id;
        const name = json.name;
        const skin = `https://crafatar.com/renders/body/${uuid}?overlay=true`;
        const embed = new EmbedBuilder()
            .setTitle(`Minecraft: ${name}`)
            .setDescription(`UUID: ${uuid}`)
            .setThumbnail(skin)
            .setColor('Yellow')
        return interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: false
        })
    }
}