const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "help",
    description: "Replies with the bots commands!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Lemon Tools Command List')
                    .setDescription("Latency: " + client.ws.ping + "ms! \n \n **General** \n `/help` - Shows all the commands \n `/ping` - Shows the bot's latency \n `/uptime` - Shows how long the bot has been up for \n `/update` - Shows the latest update of the bot \n `/sourcecode` - Shows our Git repo \n \n **Information** \n `/serverinfo` - Lets you see all the infomation about the server you are in. \n `/userinfo` - Shows you all the information about a user \n `/membercount` - Shows the server's member count \n `/boosts` - Shows the servers boost information \n \n **Moderation** \n `/kick` - Kicks the user mentioned \n `/ban` - Bans the user mentioned \n `/unban` - Lets you unban a member \n \n **Fun** \n `/urban` - Shows the urban dictonary term you inputed \n `/minesweeper` - Lets you play minesweeper \n `/reddit` - Grabs a random thread from a subreddit of your choice \n `/coinflip` - Flips a coin \n `/minecraft` - Grabs the skin and info of a Minecraft player \n \n **Education**")
                    .setColor('Yellow')
                    .setThumbnail(client.user.avatarURL())
            ],
            ephemeral: true
        })
    }
};