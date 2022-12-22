import { IRecentArticle } from "../articles/recent-article";

export interface ICategory {
    name: string;
    description: string;
    articles: IRecentArticle[];
}