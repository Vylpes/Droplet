import { Router } from "express";
import { Route } from "../contracts/Route";
import Account from "./settings/account";

export default class SettingsRouter extends Route {
    private _account: Account;

    constructor() {
        super();

        this._account = new Account(this.router);
    }

    public Route(): Router {
        this._account.Route();
        
        return super.router;
    }
}