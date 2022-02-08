"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRouter = void 0;
const Route_1 = require("../contracts/Route");
const index_1 = require("./index/index");
class IndexRouter extends Route_1.Route {
    constructor() {
        super();
        this._index = new index_1.Index(super.router);
    }
    Route() {
        this._index.Route();
        return super.router;
    }
}
exports.IndexRouter = IndexRouter;
//# sourceMappingURL=index.js.map