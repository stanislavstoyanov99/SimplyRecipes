import { ICategoryList } from "../categories/category-list";
import { IRecipeListing } from "./recipe-listing";

export interface IRecipeList {
    recipes: IRecipeListing[];
    categories: ICategoryList[];
}