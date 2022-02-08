"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const express_1 = require("express");
class Route {
    constructor() {
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    Route() {
        return this._router;
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map