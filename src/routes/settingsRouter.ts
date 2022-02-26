import { Router } from "express";
import { Route } from "../contracts/Route";
import Account from "./settings/account";
import Create from "./settings/users/create";
import List from "./settings/users/list";
import Update from "./settings/users/update";
import View from "./settings/users/view";

export default class SettingsRouter extends Route {
    private _account: Account;
    private _users: IUsersCRUD;

    constructor() {
        super();

        this._account = new Account(this.router);

        this._users = {
            Create: new Create(this.router),
            List: new List(this.router),
            View: new View(this.router),
            Update: new Update(this.router),
        };
    }

    public Route(): Router {
        this._account.Route();

        this._users.Create.Route();
        this._users.List.Route();
        this._users.View.Route();
        this._users.Update.Route();
        
        return super.router;
    }
}

interface IUsersCRUD {
    Create: Create;
    List: List;
    View: View;
    Update: Update;
}