export interface Source {
  id: string;
  name: string;
}

export interface Article {
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content?: string;
}

export interface TopHeadlines {
  status: "ok" | "error";
  code?: number;
  message?: string;
  totalResults: number;
  articles: Article[];
}
