"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edit = void 0;
const Page_1 = require("../../contracts/Page");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Edit extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/edit', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.body.taskString;
            const name = req.body.name;
            const description = req.body.description;
            if (!taskString) {
                req.session.error = "Task not found";
                res.redirect(`/tasks/list`);
                return;
            }
            if (!name) {
                req.session.error = "Name is required";
                res.redirect(`/tasks/view/${taskString}`);
                return;
            }
            const result = await Task_1.Task.EditTask(taskString, name, description, req.session.User);
            if (!result) {
                req.session.error = 'Unable to edit task';
            }
            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}
exports.Edit = Edit;
//# sourceMappingURL=edit.js.map