const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "channelcount",
    description: "Returns the number of channels in the server",
    category: "info",
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
        .setTitle("Channel Count")
        .setDescription(`There are ${message.guild.channels.cache.size} channels in this server`)
        .setColor("Yellow")
        .setTimestamp()

        message.channel.send(embed)
    }
}