import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function GetAllUsers(): Promise<User[]> {
    const usersMaybe = await ConnectionHelper.FindMultiple<User>("user", {});

    if (!usersMaybe.IsSuccess) {
        return;
    }

    const users = usersMaybe.Value;

    return users;
}