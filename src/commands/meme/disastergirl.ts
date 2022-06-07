import MemeGenerator from "../../classes/generator/MemeGenerator";

export const disastergirl = new MemeGenerator(
  {
    image: "disastergirl.jpg",
    name: "disastergirl",
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
    ctx.fillText(opts.topText!, canvas.width / 2, 65);
    ctx.fillText(opts.bottomText!, canvas.width / 2, canvas.height - 10);
    return canvas.toBuffer("image/png");
  }
);

export default disastergirl.toCommand();
