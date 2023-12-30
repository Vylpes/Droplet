import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function UpdateUserPasswordCommand(uuid: string, hashedPassword: string) {
    const userMaybe = await ConnectionHelper.FindOne<User>("user", { uuid });

    if (!userMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<User>("user", { uuid }, { $set: { password: hashedPassword } });
}