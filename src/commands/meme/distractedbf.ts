import MemeGenerator from "../../classes/generator/MemeGenerator";

export const mastermind = new MemeGenerator(
  {
    image: "distractedbf.png",
    name: "distractedbf",
    texts: ["top", "middle", "bottom"],
  },
  async function (opts) {
    const canvas = this.canvas();
    const ctx = canvas.getContext("2d");
    const image = await this.getImage();
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = "black";
    let fontSize = 100
    ctx.font = this.makeTextSize(canvas, opts.topText!, "Impact", fontSize);

    ctx.fillText(opts.topText!, canvas.width / 5 - 200, 350);
    ctx.font = this.makeTextSize(canvas, opts.topText!, "Impact", fontSize);

    ctx.fillText(opts.middleText!, canvas.width / 2.5, 150);
    ctx.font = this.makeTextSize(canvas, opts.middleText!, "Impact", fontSize);

    ctx.fillText(opts.bottomText!, canvas.width / 3 + 500, 400);
    ctx.font = this.makeTextSize(canvas, opts.bottomText!, "Impact", fontSize);

    return canvas.toBuffer("image/png");
  }
);

export default mastermind.toCommand();
