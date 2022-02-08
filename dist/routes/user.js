"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("../contracts/Route");
const account_1 = __importDefault(require("./user/settings/account"));
class User extends Route_1.Route {
    constructor() {
        super();
        this._account = new account_1.default(this.router);
    }
    Route() {
        this._account.Route();
        return super.router;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map