"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const Route_1 = require("../contracts/Route");
const login_1 = require("./auth/login");
const logout_1 = require("./auth/logout");
const register_1 = require("./auth/register");
class AuthRouter extends Route_1.Route {
    constructor() {
        super();
        this._login = new login_1.Login(super.router);
        this._logout = new logout_1.Logout(super.router);
        this._register = new register_1.Register(super.router);
    }
    Route() {
        this._login.Route();
        this._logout.Route();
        this._register.Route();
        return super.router;
    }
}
exports.AuthRouter = AuthRouter;
//# sourceMappingURL=auth.js.map