"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Done extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/done', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.body.taskString;
            const user = req.session.User;
            if (!taskString) {
                req.session.error = "All fields are required";
                res.redirect('/tasks/list');
                return;
            }
            const result = await Task_1.Task.ToggleTaskCompleteStatus(taskString, user);
            if (!result) {
                req.session.error = "There was an error";
            }
            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}
exports.default = Done;
//# sourceMappingURL=done.js.map