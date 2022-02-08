"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const User_1 = require("../../entity/User");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Assign extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/assign/assign', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.body.taskString;
            const userId = req.body.userId;
            const currentUser = req.session.User;
            if (!taskString) {
                req.session.error = "Not found";
                res.redirect('/tasks/list');
                return;
            }
            if (!userId) {
                req.session.error = "All fields are required";
                res.redirect(`/tasks/view/${taskString}`);
                return;
            }
            let result = false;
            if (userId == '{UNASSIGN}') {
                result = await Task_1.Task.UnassignUserFromTask(taskString, currentUser);
            }
            else {
                const user = await User_1.User.GetUser(userId);
                if (!user) {
                    req.session.error = "Cannot find user";
                    res.redirect(`/tasks/view/${taskString}`);
                    return;
                }
                result = await Task_1.Task.AssignUserToTask(taskString, user, currentUser);
            }
            if (result) {
                req.session.success = "Assigned user to task";
            }
            else {
                req.session.error = "Unable to assign user to task";
            }
            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}
exports.default = Assign;
//# sourceMappingURL=assign.js.map