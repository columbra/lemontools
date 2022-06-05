import { createCanvas } from "canvas";
import MemeGenerator from "../../classes/generator/MemeGenerator";
import sizeOf from "image-size";

export const mastermind = new MemeGenerator(
  {
    image: "mastermind.png",
    name: "mastermind",
    texts: ["top", , "bottom"],
  },
  async function (opts) {
    const canvas = this.canvas();
    const ctx = canvas.getContext("2d");
    const image = await this.getImage();
    ctx.drawImage(image, 0, 0);
    ctx.font = "69px Impact";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(opts.topText!, canvas.width / 2, 80);
    ctx.fillText(opts.bottomText!, canvas.width / 2, canvas.height - 50);
    return canvas.toBuffer("image/png");
  }
);

export default mastermind.toCommand();
