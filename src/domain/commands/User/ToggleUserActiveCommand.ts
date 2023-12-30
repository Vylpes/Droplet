import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../models/User/User";

export default async function ToggleUserActiveCommand(uuid: string) {
    const userMaybe = await ConnectionHelper.FindOne<User>("user", { uuid });

    if (!userMaybe.IsSuccess) {
        return;
    }

    const user = userMaybe.Value;

    await ConnectionHelper.UpdateOne<User>("user", { uuid }, { $set: { active: !user.active } });
}