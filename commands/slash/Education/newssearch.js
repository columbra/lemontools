const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const api = "" // the guardian api here

module.exports = {
    name: "nsearch",
    description: "Search for a news article from the guardian api",
    type: 1,
    options: [
        {
            name: "keyword",
            description: "The keyword you want to search for",
            type: 3,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const keyword = interaction.options.getString('keyword');
        const res = await fetch(`https://content.guardianapis.com/search?q=${keyword}&api-key=${api}`);
        const json = await res.json();
        const results = json.response.results;
        const embed = new EmbedBuilder()
            .setTitle(`The Guardian: Search Results for ${keyword}`)
            .setDescription(`Search results for ${keyword}` + results.map((result, index) => `${index}. [${result.webTitle}](${result.webUrl})`).slice(0, 10).join('\n'))
            .setThumbnail("https://media.discordapp.net/attachments/1002079964964855871/1054663332579266641/164318.png")
            .setColor('Yellow')
        return interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: false
        })
    }
}