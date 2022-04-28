import { Router } from "express";
import { Route } from "../contracts/Route";
import AdminRegister from "./auth/adminRegister";
import { Login } from "./auth/login";
import { Logout } from "./auth/logout";
import { default as RequestPasswordToken} from "./auth/passwordReset/requestToken";
import { default as RequestVerificationToken } from "./auth/verificationToken/requestToken";
import Reset from "./auth/passwordReset/reset";
import Verify from "./auth/verify";

export class AuthRouter extends Route {
    private _login: Login;
    private _logout: Logout;
    private adminRegister: AdminRegister;
    private verify: Verify;
    private passwordReset: IPasswordReset;
    private verificationToken: IVerificationToken;

    constructor() {
        super();

        this._login = new Login(super.router);
        this._logout = new Logout(super.router);
        this.adminRegister = new AdminRegister(super.router);
        this.verify = new Verify(super.router);

        this.passwordReset = {
            Request: new RequestPasswordToken(super.router),
            Reset: new Reset(super.router),
        };

        this.verificationToken = {
            Request: new RequestVerificationToken(super.router),
        };
    }

    public Route(): Router {
        this._login.Route();
        this._logout.Route();
        this.adminRegister.Route();
        this.verify.Route();

        this.passwordReset.Request.Route();
        this.passwordReset.Reset.Route();

        this.verificationToken.Request.Route();

        return super.router;
    }
}

interface IPasswordReset {
    Request: RequestPasswordToken,
    Reset: Reset,
}

interface IVerificationToken {
    Request: RequestVerificationToken,
}