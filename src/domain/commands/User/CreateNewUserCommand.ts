import { v4 } from "uuid";
import User from "../../models/User/User";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateNewUserCommand(username: string, email: string, admin: boolean): Promise<User> {
    const user: User = {
        uuid: v4(),
        username,
        email,
        admin,
        verified: false,
        password: null,
        active: true,
        whenCreated: new Date(),
        tokens: [],
    }

    await ConnectionHelper.InsertOne<User>("user", user);

    return user;
}