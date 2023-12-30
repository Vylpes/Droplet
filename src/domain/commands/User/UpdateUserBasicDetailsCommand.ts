import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function UpdateUserBasicDetailsCommand(uuid: string, email: string, username: string, admin: boolean, active: boolean) {
    const userMaybe = await ConnectionHelper.FindOne<User>("user", { uuid });

    if (!userMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<User>("user", { uuid }, { $set: { email, username, admin, active }});
}