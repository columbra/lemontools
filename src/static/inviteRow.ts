import { MessageActionRow, MessageButton } from "discord.js";

export const inviteRow = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("LINK")
    .setURL("https://top.gg/bot/896309687136436234")
    .setLabel("Vote"),
  new MessageButton()
    .setStyle("LINK")
    .setURL(
      "https://discord.com/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608"
    )
    .setLabel("Invite"),
  new MessageButton()
    .setStyle("LINK")
    .setURL("https://cooljim.github.io/lemontools")
    .setLabel("Website"),
]);
