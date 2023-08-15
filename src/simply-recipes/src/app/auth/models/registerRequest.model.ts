export class RegisterRequestModel {
    userName!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;
    gender: string = 'male';
}