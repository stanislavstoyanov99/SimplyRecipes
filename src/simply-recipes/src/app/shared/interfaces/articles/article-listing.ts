import { IArticleComment } from "../article-comments/article-comment";

export interface IArticleListing {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    shortDescription: string;
    sanitizedShortDescription: string;
    sanitizedDescription: string;
    userUsername: string;
    createdOn: Date;
    categoryName: string;
    articleComments: IArticleComment[];
}