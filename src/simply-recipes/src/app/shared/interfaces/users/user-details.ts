import { Gender } from "../../enums/gender";

export interface IUserDetails {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    isDeleted: boolean;
    createdOn: Date;
    role: string;
}