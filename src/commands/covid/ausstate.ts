import axios from "axios";
import Canvas from "canvas";
import cheerio from "cheerio";
import { MessageAttachment } from "discord.js";
import Command from "../../classes/Command";
import { simpleEmbed } from "../../util/embed";

export default new Command({
  name: "nswcovid",
  description: "Get COVID-19 cases for NSW today",
  category: "covid",
  perms: [],

  async execute({ bot, ctx }) {
    await ctx.deferReply();
    const { data } = await axios.get(
      "https://www.nsw.gov.au/covid-19/stay-safe/data-and-statistics"
    );
    const $ = cheerio.load(data);
    const cases = $(".statistics__item--count").first().text();
    const canvas = Canvas.createCanvas(700, 300); // Arbitrary numbers because idk
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.font = "96px sans-serif";
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    const nswLogo = await Canvas.loadImage(
      "https://www.digital.nsw.gov.au/sites/default/files/inline-images/nsw-government-logo.png"
    );
    canvasCtx.drawImage(nswLogo, 25, 25, 250, 250);
    canvasCtx.fillStyle = "black";
    canvasCtx.fillText(`${(+cases).toLocaleString()}`, canvas.width / 2.3, canvas.height / 1.6);
    canvasCtx.font = "48px sans-serif"
    canvasCtx.fillText(`Total new cases`, canvas.width / 2.3, canvas.height / 1.2);

    const att = new MessageAttachment(canvas.toBuffer(), "covid.png");
    ctx.editReply({
      embeds: [
        simpleEmbed(
          `Cases for <t:${Math.round(Date.now() / 1000)}:d>: \`${cases}\``,
          bot
        ),
      ],
      files: [att],
    });
  },
});
