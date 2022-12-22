import { Difficulty } from "../../enums/difficulty";
import { ICategory } from "../categories/category";

export interface IRecipeListing {
    id: number;
    name: string;
    imagePath: string;
    rate: number;
    difficulty: Difficulty;
    createdOn: Date;
    category: ICategory;
}