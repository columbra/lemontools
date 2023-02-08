const { EmbedBuilder } = require('discord.js');

module.exports = {
name: "randomnumber",
description: "Generates a random number between the given range",
type: 1,
options: [
{
name: "lowest",
description: "The lowest possible number",
type: 3,
required: true
},
{
name: "highest",
description: "The highest possible number",
type: 3,
required: true
}
],
permissions: {
DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
},
run: async (client, interaction, config, db) => {
const lowest = interaction.options.getNumber('lowest');
const highest = interaction.options.getNumber('highest');
if (highest <= lowest) {
    const embed = new EmbedBuilder()
        .setTitle('Lemon Tools: Random Number')
        .setDescription(`The highest value must be greater than the lowest value!`)
        .setColor('Red')
    return interaction.reply({
        embeds: [
            embed
        ],
        ephemeral: true
    })
}

const randomNum = Math.floor(Math.random() * (highest - lowest + 1)) + lowest;

const embed = new EmbedBuilder()
    .setTitle('Lemon Tools: Random Number')
    .setDescription(`The random number is: ${randomNum}`)
    .setColor('Green')

return interaction.reply({
    embeds: [
        embed
    ],
    ephemeral: true
});
}
}