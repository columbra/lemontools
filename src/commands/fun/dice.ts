import Command from "../../classes/Command";
import { simpleEmbed } from "../../util/embed";
import { rnd } from "../../util/number";
import {
  Canvas,
  createCanvas,
  CanvasRenderingContext2D as NodeCanvasRenderingContext2D,
} from "canvas";
import { MessageAttachment } from "discord.js";

export default new Command({
  name: "dice",
  description: "Roll a six sided dice",
  category: "fun",
  perms: [],

  async execute({ ctx, bot }) {
    /**
     * Code is taken from Lemon Tools v1x
     */
    function drawDice(
      canvas: Canvas,
      ctx: NodeCanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      value: number,
      diceColor: string,
      dotColor: string
    ) {
      const dots = [];
      ctx.save();
      ctx.fillStyle = diceColor;
      ctx.translate(x, y);
      roundRect(ctx, 0, 0, size, size, size * 0.1, true, true);

      //define dot locations
      let padding = 0.25;
      var x: number, y: number; // For back-compatibility
      x = padding * size;
      y = padding * size;
      dots.push({ x: x, y: y });
      y = size * 0.5;
      dots.push({ x: x, y: y });
      y = size * (1 - padding);
      dots.push({ x: x, y: y });
      x = size * 0.5;
      y = size * 0.5;
      dots.push({ x: x, y: y });
      x = size * (1 - padding);
      y = padding * size;
      dots.push({ x: x, y: y });
      y = size * 0.5;
      dots.push({ x: x, y: y });
      y = size * (1 - padding);
      dots.push({ x: x, y: y });
      //for(let i=0; i<dots.length; i++) console.log(dots[i]);

      let dotsToDraw;
      if (value == 1) dotsToDraw = [3];
      else if (value == 2) dotsToDraw = [0, 6];
      else if (value == 3) dotsToDraw = [0, 3, 6];
      else if (value == 4) dotsToDraw = [0, 2, 4, 6];
      else if (value == 5) dotsToDraw = [0, 2, 3, 4, 6];
      else if (value == 6) dotsToDraw = [0, 1, 2, 4, 5, 6];
      else throw new Error("Dice value shall be between 1 and 6");

      ctx.fillStyle = dotColor;
      for (let i = 0; i < dotsToDraw.length; i++) {
        ctx.beginPath();
        let j = dotsToDraw[i];
        ctx.arc(dots[j].x, dots[j].y, size * 0.07, 0, 2 * Math.PI);
        ctx.fill();
      }
      return canvas.toBuffer();
    }

    // I took the roundRect function below from here:
    // http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    function roundRect(
      ctx: {
        beginPath: () => void;
        moveTo: (arg0: any, arg1: any) => void;
        lineTo: (arg0: number, arg1: number) => void;
        quadraticCurveTo: (
          arg0: any,
          arg1: any,
          arg2: number,
          arg3: number
        ) => void;
        closePath: () => void;
        fill: () => void;
        stroke: () => void;
      },
      x: number,
      y: number,
      width: any,
      height: any,
      radius: any,
      fill: boolean,
      stroke: boolean
    ) {
      if (typeof stroke == "undefined") {
        stroke = true;
      }
      if (typeof radius === "undefined") {
        radius = 5;
      }
      if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        let defaultRadius: any = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (let side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
      );
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      }
      if (stroke) {
        ctx.stroke();
      }
    }

    function dice(value: number) {
      let canvas: Canvas, ctx: NodeCanvasRenderingContext2D;
      let diceColor = "white";
      let dotColor = "#332";

      canvas = createCanvas(200, 200);
      ctx = canvas.getContext("2d");
      return drawDice(canvas, ctx, 50, 50, 100, value, diceColor, dotColor);
    }
    const num = rnd(1, 6);
    const img = dice(num);
    ctx.reply({
      embeds: [simpleEmbed(`:game_die: You rolled a ${num}.`, bot)],
      files: [new MessageAttachment(img, "dice.png")],
    });
  },
});
