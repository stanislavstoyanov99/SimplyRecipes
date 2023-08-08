import { IRecentArticle } from "../articles/recent-article";

export interface ICategory {
    name: string;
    sanitizedDescription: string;
    articles: IRecentArticle[];
}