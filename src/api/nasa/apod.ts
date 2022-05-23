/**
 * @fileoverview NASA APOD wrapper
 * @since v3.0.0
 */

import axios from "axios";
import type { MessageEmbedOptions } from "discord.js";
import type APIWrapper from "../../utils/typings/api/APIWrapper";

export default class Apod implements APIWrapper {
  name = "apod";
  static async get() {
    const { data } = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`
    );
    const embed = {
      title: data.title,
      description: data.explanation,
      image: {
        url: data.hdurl,
      },
      footer: {
        text: data.copyright
          ? `Copyright ©️ ${data.copyright}`
          : "Image courtesy of NASA",
      },
      timestamp: new Date(),
    } as MessageEmbedOptions;

    return embed;
  }
}

export interface APIResponse {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}