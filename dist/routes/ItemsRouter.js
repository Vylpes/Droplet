"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("../contracts/Route");
const list_1 = __importDefault(require("./items/list"));
const new_1 = __importDefault(require("./items/new"));
class ItemsRouter extends Route_1.Route {
    constructor() {
        super();
        this.list = new list_1.default(this.router);
        this.create = new new_1.default(super.router);
    }
    Route() {
        this.list.Route();
        this.create.Route();
        return this.router;
    }
}
exports.default = ItemsRouter;
//# sourceMappingURL=ItemsRouter.js.map