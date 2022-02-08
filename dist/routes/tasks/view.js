"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const UserProjectRole_1 = require("../../constants/UserProjectRole");
const Page_1 = require("../../contracts/Page");
const ProjectUser_1 = require("../../entity/ProjectUser");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class View extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/view/:taskString', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const taskString = req.params.taskString;
            const task = await Task_1.Task.GetTaskByTaskString(taskString, req.session.User);
            if (!task) {
                req.session.error = "Task not found";
                res.redirect('/tasks/list');
                return;
            }
            res.locals.viewData.task = task;
            if (task.Archived) {
                res.locals.viewData.canEditTask = false;
                res.locals.viewData.canAssignTask = false;
                res.locals.viewData.canArchiveTask = true;
            }
            else {
                res.locals.viewData.canEditTask = await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.TaskUpdate);
                res.locals.viewData.canAssignTask = await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.TaskAssign);
                res.locals.viewData.canArchiveTask = res.locals.viewData.canEditTask;
            }
            res.render('tasks/view', res.locals.viewData);
        });
    }
}
exports.View = View;
//# sourceMappingURL=view.js.map