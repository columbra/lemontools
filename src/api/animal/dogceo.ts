/**
 * @fileoverview API Wrapper for Dog CEO API, gets random dogs
 * @since v3.0.0
 */

import axios from "axios";
import type { MessageEmbedOptions } from "discord.js";
import type APIWrapper from "../../utils/typings/api/APIWrapper";

export default class DogCEO implements APIWrapper {
  name = "dogceo";
  static async get() {
    const { data } = await axios.get(`https://dog.ceo/api/breeds/image/random`);
    if (!data.status) throw new Error(`DogCEO API Error: ${data.message}`);

    const embed: MessageEmbedOptions = {
      image: {
        url: data.message,
      },
      title: `Random Dog!`
    };

    return embed;
  }
}
