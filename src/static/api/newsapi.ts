import request from "request";
import { Country } from "../../interfaces/Country";
import { TopHeadlines } from "../../interfaces/NewsAPI";

export class NewsAPI {
  static headlines(country: keyof typeof Country) {
    return new Promise((resolve, reject) => {
      request(
        `https://newsapi.org/v2/top-headlines?country=${country.toLowerCase()}`,
        {
          headers: {
            "X-Api-Key": process.env.NEWS_API,
          },
          json: true,
        },
        (err, res, body) => {
          if (err) reject(err);
          if (body.status !== "ok") reject(`Not OK HTTP Status ${body.status}`);
          resolve(body as TopHeadlines);
        }
      );
    });
  }
}
