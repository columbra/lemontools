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
      "https://www.health.nsw.gov.au/Infectious/covid-19/Pages/default.aspx"
    );
    const $ = cheerio.load(data);
    const getUl = (num: number) =>
      $("div.calloutbox.statistics > ul")
        .children("li")
        .eq(num)
        .children("span.number")
        .text();
    const cases = getUl(0);
    const rat = getUl(1);
    const pcr = getUl(2);
    const canvas = Canvas.createCanvas(700, 300); // Arbitrary numbers because idk
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.font = "72px sans-serif";
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    const nswLogo = await Canvas.loadImage(
      "https://www.digital.nsw.gov.au/sites/default/files/inline-images/nsw-government-logo.png"
    );
    canvasCtx.drawImage(nswLogo, 25, 25, 250, 250);
    canvasCtx.fillStyle = "black";
    canvasCtx.fillText(`${cases}`, canvas.width / 2.3, canvas.height / 2.8);
    canvasCtx.fillText(`${rat}`, canvas.width / 2.3, canvas.height / 1.3);

    canvasCtx.font = "32px sans-serif";
    canvasCtx.fillText(`Total Cases`, canvas.width / 2.3, canvas.height / 2);
    canvasCtx.fillText(`RAT`, canvas.width / 2.3, canvas.height / 1.1);

    const att = new MessageAttachment(canvas.toBuffer(), "covid.png");
    ctx.editReply({
      embeds: [
        simpleEmbed(
          `Data for <t:${Math.round(Date.now() / 1000)}:d>
          Total Cases: \`${cases}\`
          ╚═ PCR: \`${pcr}\`
          ╚═ RAT: \`${rat}\``,
          bot
        ),
      ],
      files: [att],
    });
  },
});
