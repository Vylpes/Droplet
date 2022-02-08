"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assigned = void 0;
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Assigned extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/assigned', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            res.locals.viewData.tasks = await Task_1.Task.GetAssignedTasks(req.session.User.Id);
            res.render('tasks/assigned', res.locals.viewData);
        });
    }
}
exports.Assigned = Assigned;
//# sourceMappingURL=assigned.js.map