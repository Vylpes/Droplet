import { Router } from "express";
import { Route } from "../contracts/Route";
import AdminRegister from "./auth/adminRegister";
import { Login } from "./auth/login";
import { Logout } from "./auth/logout";
import Verify from "./auth/verify";

export class AuthRouter extends Route {
    private _login: Login;
    private _logout: Logout;
    private adminRegister: AdminRegister;
    private verify: Verify;

    constructor() {
        super();

        this._login = new Login(super.router);
        this._logout = new Logout(super.router);
        this.adminRegister = new AdminRegister(super.router);
        this.verify = new Verify(super.router);
    }

    public Route(): Router {
        this._login.Route();
        this._logout.Route();
        this.adminRegister.Route();
        this.verify.Route();

        return super.router;
    }
}