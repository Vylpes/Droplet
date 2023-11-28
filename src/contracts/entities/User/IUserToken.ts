import { UserTokenType } from "../../../constants/UserTokenType";

export default interface IUserToken {
    uuid: string,
    token: string;
    expires: Date;
    Type: UserTokenType;
}