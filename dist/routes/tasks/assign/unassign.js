"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../../contracts/Page");
const Task_1 = require("../../../entity/Task");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
class Unassign extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/assign/unassign', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.body.taskString;
            const user = req.session.User;
            if (!taskString) {
                req.session.error = "Not found";
                res.redirect('/tasks/list');
                return;
            }
            const result = await Task_1.Task.UnassignUserFromTask(taskString, user);
            if (result) {
                req.session.success = "Unassigned user from task";
            }
            else {
                req.session.error = "Unable to unassign user from task";
            }
            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}
exports.default = Unassign;
//# sourceMappingURL=unassign.js.map