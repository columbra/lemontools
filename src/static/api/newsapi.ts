import axios from "axios";
import { Country } from "../../interfaces/Country";
import { TopHeadlines } from "../../interfaces/NewsAPI";

export class NewsAPI {
  static headlines(country: keyof typeof Country) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://newsapi.org/v2/top-headlines?country=${country.toLowerCase()}`,
          {
            headers: {
              "X-Api-Key": process.env.NEWS_API!,
            },
          }
        )
        .then((res) => {
          if (res.data.status !== "ok")
            reject(`Not OK HTTP Status ${res.data.status}`);
          resolve(res.data as TopHeadlines);
        })
        .catch(reject);
    });
  }
}
