const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "reddit",
    description: "Search reddit",
    type: 1,
    options: [
        {
            name: "subreddit",
            description: "The subreddit you want to search",
            type: 3,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        const subreddit = interaction.options.getString('subreddit');
        const url = `https://www.reddit.com/r/${subreddit}/random/.json`;
        const res = await fetch(url).then(url => url.json());
        const embed = new EmbedBuilder()
            .setTitle(res[0].data.children[0].data.title)
            .setURL(res[0].data.children[0].data.url)
            .setDescription(res[0].data.children[0].data.selftext)
            .setThumbnail("https://images-ext-2.discordapp.net/external/ZHy6j3d-FYC3u48t_F9syEE0DFh3pewPFhsxm1wSkhU/%3Fauto%3Dwebp%26s%3D38648ef0dc2c3fce76d5e1d8639234d8da0152b2/https/external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png")
            .setColor('Yellow')
        return interaction.reply({
            embeds: [embed],
            ephemeral: false
        })
    }
};