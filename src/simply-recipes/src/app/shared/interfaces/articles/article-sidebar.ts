import { ICategory } from "../categories/category";
import { IRecentArticle } from "./recent-article";

export interface IArticleSidebar {
    categories: ICategory[];
    recentArticles: IRecentArticle[];
}