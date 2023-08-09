export interface IRecipeCreate {
    name: string;
    description: string;
    ingredients: string;
    preparationTime: number;
    cookingTime: number;
    portionsNumber: number;
    difficulty: string;
    imagePath: string;
    categoryId: number;
}