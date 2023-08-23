import { ITopArticle as ITopArticleComment } from "./top-article";
import { ITopCategory } from "./top-category";
import { ITopRecipe } from "./top-recipe";

export interface IStatistics {
    recipesCount: number;
    articlesCount: number;
    reviewsCount: number;
    registeredUsersCount: number;
    adminsCount: number;
    articleCommentsCount: number;
    topCategories: ITopCategory[];
    topRecipes: ITopRecipe[];
    topArticleComments: ITopArticleComment[];
    registeredUsersPerMonth: { [key: string]: number };
    registeredAdminsPerMonth: { [key: string]: number };
}