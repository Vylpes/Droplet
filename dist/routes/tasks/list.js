"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class List extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/list', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            res.locals.viewData.tasks = await Task_1.Task.GetAllTasks(req.session.User);
            res.render('tasks/list', res.locals.viewData);
        });
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map