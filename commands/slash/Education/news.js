const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const api = "" // the guardian api here

module.exports = {
    name: "news",
    description: "Get a random news article from the guardian api",
    type: 1,
    options: [
        {
            name: "category",
            description: "The category you want to get a news article from",
            type: 3,
            required: true,
            choices: [
                {
                    name: "World",
                    value: "world"
                },
                {
                    name: "UK",
                    value: "uk-news"
                },
                {
                    name: "US",
                    value: "us-news"
                },
                {
                    name: "Politics",
                    value: "politics"
                },
                {
                    name: "Business",
                    value: "business"
                },
                {
                    name: "Technology",
                    value: "technology"
                },
                {
                    name: "Science",
                    value: "science"
                },
                {
                    name: "Health",
                    value: "health"
                },
                {
                    name: "Education",
                    value: "education"
                },
                {
                    name: "Law",
                    value: "law"
                },
                {
                    name: "Travel",
                    value: "travel"
                },
                {
                    name: "Money",
                    value: "money"
                },
                {
                    name: "Food",
                    value: "food"
                },
                {
                    name: "TV and radio",
                    value: "tv-and-radio"
                },
                {
                    name: "Music",
                    value: "music"
                },
                {
                    name: "Film",
                    value: "film"
                },
                {
                    name: "Games",
                    value: "games"
                },
            ]
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const category = interaction.options.getString('category');
        const res = await fetch(`https://content.guardianapis.com/search?api-key=${api}&section=${category}&show-blocks=all`);
        const json = await res.json();
        const article = json.response.results[Math.floor(Math.random() * json.response.results.length)];
        const title = article.webTitle;
        const url = article.webUrl;
        const embed = new EmbedBuilder()
            .setTitle(`The Guardian: ${title}`)
            .setDescription(`${article.blocks.body[0].bodyTextSummary.substring(0, 200)}... \n \n [Click me to read more](${url})`)
            .setImage(article.blocks.main.elements[0].assets[article.blocks.main.elements[0].assets.length - 1].file)
            .setThumbnail("https://media.discordapp.net/attachments/1002079964964855871/1054663332579266641/164318.png")
            .setColor('Yellow')
        return interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: false
        })
    }
};