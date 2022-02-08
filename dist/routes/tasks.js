"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRouter = void 0;
const Route_1 = require("../contracts/Route");
const assign_1 = __importDefault(require("./tasks/assign"));
const assigned_1 = require("./tasks/assigned");
const edit_1 = require("./tasks/edit");
const list_1 = require("./tasks/list");
const new_1 = require("./tasks/new");
const view_1 = require("./tasks/view");
const done_1 = __importDefault(require("./tasks/done"));
const archive_1 = __importDefault(require("./tasks/archive"));
class TasksRouter extends Route_1.Route {
    constructor() {
        super();
        this._list = new list_1.List(super.router);
        this._assigned = new assigned_1.Assigned(super.router);
        this._new = new new_1.New(super.router);
        this._view = new view_1.View(super.router);
        this._edit = new edit_1.Edit(super.router);
        this._assign = new assign_1.default(super.router);
        this._done = new done_1.default(super.router);
        this._archive = new archive_1.default(super.router);
    }
    Route() {
        this._list.Route();
        this._assigned.Route();
        this._new.Route();
        this._view.Route();
        this._edit.Route();
        this._assign.Route();
        this._done.Route();
        this._archive.Route();
        return super.router;
    }
}
exports.TasksRouter = TasksRouter;
//# sourceMappingURL=tasks.js.map