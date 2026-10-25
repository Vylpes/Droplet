import ApiRoute from "../../../contracts/ApiRoute";
import Account from "./account";
import UsersRouter from "./users";

export default class SettingsRouter extends ApiRoute {
    constructor() {
        super(true);

        this.AddSubRoute("/users", new UsersRouter());

        this.AddPage("/account", new Account());
    }
}
