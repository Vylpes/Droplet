import { v4 } from "uuid";
import { UserTokenType } from "../../../constants/UserTokenType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import IUserToken from "../../models/User/IUserToken";
import User from "../../models/User/User";

export default async function AddTokenToUserCommand(userId: string, token: string, expires: Date, type: UserTokenType) {
    const user = await ConnectionHelper.FindOne<User>("user", { uuid: userId });

    if (!user.IsSuccess) {
        return;
    }

    const userToken: IUserToken = {
        uuid: v4(),
        token,
        expires,
        type,
    };

    await ConnectionHelper.UpdateOne<User>("user", { uuid: userId }, { $push: { tokens: userToken } });
}