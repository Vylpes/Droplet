"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const Route_1 = require("../contracts/Route");
const index_1 = require("./dashboard/index");
class DashboardRouter extends Route_1.Route {
    constructor() {
        super();
        this._index = new index_1.Index(super.router);
    }
    Route() {
        this._index.Route();
        return super.router;
    }
}
exports.DashboardRouter = DashboardRouter;
//# sourceMappingURL=dashboard.js.map