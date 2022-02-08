"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsRouter = void 0;
const Route_1 = require("../contracts/Route");
const list_1 = require("./projects/list");
const new_1 = require("./projects/new");
const view_1 = require("./projects/view");
const assign_1 = require("./projects/assign/assign");
const unassign_1 = require("./projects/assign/unassign");
const update_1 = require("./projects/assign/update");
const tasks_1 = require("./projects/tasks");
const general_1 = __importDefault(require("./projects/settings/general"));
const assigned_1 = __importDefault(require("./projects/settings/assigned"));
class ProjectsRouter extends Route_1.Route {
    constructor() {
        super();
        this._list = new list_1.List(super.router);
        this._new = new new_1.New(super.router);
        this._view = new view_1.View(super.router);
        this._assignAssign = new assign_1.Assign(super.router);
        this._assignUnassign = new unassign_1.Unassign(super.router);
        this._assignUpdate = new update_1.Update(super.router);
        this._tasks = new tasks_1.Tasks(super.router);
        this._settingsGeneral = new general_1.default(super.router);
        this._settingsAssigned = new assigned_1.default(super.router);
    }
    Route() {
        this._list.Route();
        this._new.Route();
        this._view.Route();
        this._assignAssign.Route();
        this._assignUnassign.Route();
        this._assignUpdate.Route();
        this._tasks.Route();
        this._settingsGeneral.Route();
        this._settingsAssigned.Route();
        return super.router;
    }
}
exports.ProjectsRouter = ProjectsRouter;
//# sourceMappingURL=projects.js.map