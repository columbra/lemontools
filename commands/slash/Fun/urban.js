const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "urban",
    description: "Search the urban dictionary",
    type: 1,
    options: [
        {
            name: "term",
            description: "The term you want to search",
            type: 3,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const term = interaction.options.getString('term');
        const url = `https://api.urbandictionary.com/v0/define?term=${term}`;
        const res = await fetch(url).then(url => url.json());
        const embed = new EmbedBuilder()
            .setTitle(res.list[0].word)
            .setURL(res.list[0].permalink)
            .setDescription(res.list[0].definition + "\n **Example:** " + res.list[0].example + "\n **Author:** " + res.list[0].author + "\n **Rating:** " + res.list[0].thumbs_up)
            .setThumbnail("https://media.discordapp.net/attachments/1002079964964855871/1052503156979929149/69eacff302f587d399c3b99c1183d94a.png")
            .setColor('Yellow')
        return interaction.reply({
            embeds: [embed],
            ephemeral: false
        })
    }
};
