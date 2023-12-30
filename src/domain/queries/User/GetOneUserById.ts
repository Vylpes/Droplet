import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function GetOneUserById(uuid: string): Promise<User> {
    const user = await ConnectionHelper.FindOne<User>("user", { uuid });

    if (!user.IsSuccess) {
        return Promise.reject("Unable to find user");
    }

    return user.Value;
}