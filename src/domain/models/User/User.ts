import IUserToken from "./IUserToken";

export default interface User {
    uuid: string,
    email: string;
    username: string;
    password: string;
    verified: boolean;
    admin: boolean;
    active: boolean;
    whenCreated: Date;
    whenLastLoggedIn?: Date;
    tokens: IUserToken[];
}