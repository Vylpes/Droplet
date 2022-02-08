"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const UserProjectRole_1 = require("../../constants/UserProjectRole");
const Page_1 = require("../../contracts/Page");
const Project_1 = require("../../entity/Project");
const ProjectUser_1 = require("../../entity/ProjectUser");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class View extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/view/:projectId', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const project = await Project_1.Project.GetProject(req.params.projectId, req.session.User);
            if (!project) {
                req.session.error = "Project not found";
                res.redirect('/projects/list');
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(req.params.projectId, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.View))) {
                req.session.error = "Project not found";
                res.redirect('/projects/list');
                return;
            }
            const role = await ProjectUser_1.ProjectUser.GetRole(project.Id, req.session.User.Id);
            res.locals.viewData.project = project;
            res.locals.viewData.projectUsers = project.ProjectUsers;
            res.locals.viewData.userProjectRole = role;
            res.locals.viewData.canCreateTask = await ProjectUser_1.ProjectUser.HasPermission(project.Id, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.TaskCreate);
            res.locals.viewData.canEditProject = await ProjectUser_1.ProjectUser.HasPermission(project.Id, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.Update);
            res.render('projects/view', res.locals.viewData);
        });
    }
}
exports.View = View;
//# sourceMappingURL=view.js.map