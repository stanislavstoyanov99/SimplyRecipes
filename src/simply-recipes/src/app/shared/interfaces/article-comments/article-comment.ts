export interface IArticleComment {
    id: number;
    parentId: number | null;
    sanitizedContent: string;
    createdOn: Date;
    userUserName: string;
}