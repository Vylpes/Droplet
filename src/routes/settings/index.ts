import Route from "../../contracts/Route";
import Account from "./account";
import UsersRouter from "./users";

export default class SettingsRouter extends Route {
    constructor() {
        super(true);

        this.AddSubRoute("/users", new UsersRouter());

        this.AddPage("/account", new Account());
    }
}