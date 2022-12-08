import { Difficulty } from "../enums/difficulty";

export interface IRecipeListing {
    id: number;
    name: string;
    imagePath: string;
    rate: number;
    difficulty: Difficulty;
    createdOn: Date;
    category: any; // fix this when I add Category model
}