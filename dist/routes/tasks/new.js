"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const Page_1 = require("../../contracts/Page");
const Project_1 = require("../../entity/Project");
const Task_1 = require("../../entity/Task");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class New extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/new', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const name = req.body.name;
            const description = req.body.description;
            const createdBy = req.session.User;
            const projectId = req.body.projectId;
            if (!projectId) {
                req.session.error = "Project not found";
                res.redirect('/tasks/list');
                return;
            }
            if (!name) {
                req.session.error = "Name is required";
                res.redirect(`/projects/view/${projectId}`);
                return;
            }
            const project = await Project_1.Project.GetProject(projectId, req.session.User);
            if (!project) {
                req.session.error = "Project not found";
                res.redirect('/tasks/list');
                return;
            }
            const task = await Task_1.Task.CreateTask(name, description, createdBy, project);
            if (!task) {
                req.session.error = "Unable to create task";
            }
            res.redirect(`/projects/view/${projectId}/tasks`);
            return;
        });
    }
}
exports.New = New;
//# sourceMappingURL=new.js.map