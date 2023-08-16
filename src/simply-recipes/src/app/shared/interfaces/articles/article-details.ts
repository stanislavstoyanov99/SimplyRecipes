export interface IArticleDetails {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    sanitizedDescription: string;
    sanitizedShortDescription: string;
    userUsername: string;
    userId: string;
    categoryId: number;
}