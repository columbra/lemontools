import MemeGenerator from "../../classes/generator/MemeGenerator";

export const womanyellcat = new MemeGenerator(
  {
    image: "womanyellcat.jpg",
    name: "womanyellsatcat",
    texts: ["top", , "bottom"],
  },
  async function (opts) {
    const canvas = this.canvas();
    const ctx = canvas.getContext("2d");
    const image = await this.getImage();
    ctx.drawImage(image, 0, 0);
    ctx.font = "42px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(opts.topText!, canvas.width / 4, 45);
    ctx.fillText(opts.bottomText!, canvas.width - 175, 45);
    return canvas.toBuffer("image/png");
  }
);

export default womanyellcat.toCommand();
