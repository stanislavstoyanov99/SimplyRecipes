import { IArticleListing } from "./article-listing";
import { ICategory } from "../categories/category";
import { IRecentArticle } from "./recent-article";

export interface IArticleDetails {
    articleListing: IArticleListing;
    categories: ICategory[];
    recentArticles: IRecentArticle[];
}