import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function GetOneUserByUsername(username: string): Promise<User> {
    const user = await ConnectionHelper.FindOne<User>("user", { username });

    if (!user.IsSuccess) {
        return Promise.reject("Unable to find user");
    }

    return user.Value;
}