/**
 * @fileoverview MemeGenerator class for common meme generation code
 * @since v3.0.0
 */

import { MessageAttachment } from "discord.js";
import type LemonTools from "../../LemonTools";
import Command from "../commands/Command";
import sizeOf from "image-size";
import path from "path";
import { Canvas, createCanvas, loadImage } from "canvas";

export default class MemeGenerator {
  generate: WrapperFunction;
  constructor(public opts: InitOptions, generate: GeneratorFunction) {
    this.generate = (lemontools, opts) => {
      try {
        return generate.bind(this)(opts);
      } catch (err) {
        lemontools.Logger.log(
          "error",
          `MemeGenerator`,
          `Failed. ${this.opts.name} ${err}`
        );
        throw new Error(`MemeGenerator failure ${this.opts.name} ${err}`);
      }
    };
  }

  public canvas() {
    const dimentions = sizeOf(
      path.join(__dirname, "../../asset/meme/", this.opts.image)
    );
    return createCanvas(dimentions.width!, dimentions.height!);
  }

  public getImage() {
    return loadImage(
      path.join(__dirname, "../../asset/meme/", this.opts.image)
    );
  }

  public makeTextSize(
    canvas: Canvas,
    text: string,
    font: string,
    baseSize: number
  ) {
    const context = canvas.getContext("2d");

    let size = baseSize;

    do {
      // Assign the font to the context and decrement it so it can be measured again
      context.font = `${(size -= 10)}px ${font}`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width / 2);

    // Return the result to use in the actual canvas
    return context.font;
  }

  public toCommand() {
    return new Command(
      {
        category: "memes",
        description: `Generate a meme using the ${this.opts.name} generator.`,
        name: this.opts.name,
        options: this.opts.texts
          .filter((v) => v)
          .map((v) => {
            return {
              name: v + "text",
              description: "Text to use for the meme.",
              type: "STRING",
              required: true,
            };
          }),
      },
      async ({ ctx, lemontools }) => {
        await ctx.interaction.deferReply();
        const opts: GeneratorOptions = {};
        this.opts.texts
          .filter((v) => v)
          .forEach((v) => {
            opts[v + "Text"] = ctx.interaction.options.getString(
              v + "text",
              true
            );
          });
        const image = await this.generate(lemontools, opts);
        return ctx.interaction.editReply({
          files: [new MessageAttachment(image)],
        });
      }
    );
  }
}

export interface InitOptions {
  image: string;
  name: string;
  // Top - Middle - Bottom
  texts: ["top"?, "middle"?, "bottom"?];
}

type WrapperFunction = (
  lemontools: LemonTools,
  opts: GeneratorOptions
) => Promise<Buffer>;

type GeneratorFunction = (
  this: MemeGenerator,
  opts: GeneratorOptions
) => Promise<Buffer>;

export interface GeneratorOptions {
  topText?: string;
  bottomText?: string;
  middleText?: string;
  [key: string]: unknown;
}
