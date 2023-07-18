import { IRecipeDetails } from "../recipes/recipe-details";

export interface IReviewDetails {
    id: number;
    title: string;
    description: string;
    rate: number;
    recipe: IRecipeDetails;
    userId: string;
    userUsername: string;
    createdOn: Date;
}