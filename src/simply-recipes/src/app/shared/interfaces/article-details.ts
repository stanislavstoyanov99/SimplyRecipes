import { IArticleListing } from "./article-listing";
import { ICategory } from "./category";
import { IRecentArticle } from "./recent-article";

export interface IArticleDetails {
    articleListingViewModel: IArticleListing;
    categories: ICategory[];
    recentArticles: IRecentArticle[];
}