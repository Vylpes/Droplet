import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function GetOneUserByEmail(email: string): Promise<User> {
    const user = await ConnectionHelper.FindOne<User>("user", { email });

    if (!user.IsSuccess) {
        return Promise.reject("Unable to find user");
    }

    return user.Value;
}