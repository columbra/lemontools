const Roblox = require("roblox-js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roblox",
  description: "Get information about a Roblox user",
  type: 1,
  options: [
    {
      name: "username",
      description: "The username of the Roblox user",
      type: 3,
      required: true
    }
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db) => {
    const username = interaction.options.getString("username");
    const userId = await Roblox.getIdFromUsername(username);
    if (!userId) {
      const embed = new EmbedBuilder()
        .setTitle("Lemon Tools: Roblox")
        .setDescription(`The user ${username} does not exist!`)
        .setColor("Red");
      return interaction.reply({
        embeds: [embed],
        ephemeral: false
      });
    }
    const headshot = await Roblox.getHeadshotImageUrl(userId);
    const rap = await Roblox.getRankInGroup(1, userId);
    const creationDate = await Roblox.getJoinDate(userId);
    const embed = new EmbedBuilder()
      .setTitle("Lemon Tools: Roblox")
      .setDescription(`**Username:** ${username || "None"}
      **ID:** ${userId || "None"}
      **RAP:** ${rap || "None"}
      **Creation Date:** ${creationDate || "None"}`)
      .setThumbnail(headshot)
      .setColor("Green");
    return interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
