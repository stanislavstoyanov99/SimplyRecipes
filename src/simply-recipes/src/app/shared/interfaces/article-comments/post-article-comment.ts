export interface IPostArticleComment {
    articleId: number;
    parentId: number | null;
    content: string;
}