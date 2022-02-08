"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Archive extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/archive', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.body.taskString;
            const currentUser = req.session.User;
            if (!taskString) {
                req.session.error = "All fields are required";
                res.redirect('/tasks/list');
                return;
            }
            const result = await Task_1.Task.ToggleTaskArchiveStatus(taskString, currentUser);
            if (!result) {
                req.session.error = "There was an error, please try again";
            }
            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}
exports.default = Archive;
//# sourceMappingURL=archive.js.map