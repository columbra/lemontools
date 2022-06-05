import { createCanvas } from "canvas";
import MemeGenerator from "../../classes/generator/MemeGenerator";
import sizeOf from "image-size";

export const buttonMeme = new MemeGenerator(
  {
    image: "buttonmeme.jpg",
    name: "buttonmeme",
    texts: ["top",,],
  },
  async function (opts) {
    const canvas = this.canvas();
    const ctx = canvas.getContext("2d");
    const image = await this.getImage();
    ctx.drawImage(image, 0, 0);
    ctx.font = "42px Impact";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(opts.topText!, canvas.width / 3 - 25, canvas.height / 2 + 70);
    return canvas.toBuffer("image/png");
  }
);

export default buttonMeme.toCommand();
