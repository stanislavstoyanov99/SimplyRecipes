import { Difficulty } from "../../enums/difficulty";
import { ICategory } from "../categories/category";
import { IReviewDetails } from "../reviews/review-details";

export interface IRecipeDetails {
    id: number;
    name: string;
    sanitizedDescription: string;
    sanitizedIngredients: string;
    preparationTime: number;
    cookingTime: number;
    portionsNumber: number;
    imagePath: string;
    rate: number;
    difficulty: Difficulty;
    createdOn: Date;
    category: ICategory;
    userUsername: string;
    userId: string;
    reviews: IReviewDetails[];
}