"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserProjectRole_1 = require("../../../constants/UserProjectRole");
const Page_1 = require("../../../contracts/Page");
const Project_1 = require("../../../entity/Project");
const ProjectUser_1 = require("../../../entity/ProjectUser");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
class Assigned extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/settings/assigned/:projectId', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.params.projectId;
            const user = req.session.User;
            if (!projectId) {
                req.session.error = "Project not found or you do not have the permission to view it";
                res.redirect('/projects/list');
                return;
            }
            const project = await Project_1.Project.GetProject(projectId, user);
            if (!project) {
                req.session.error = "Project not found or you do not have the permission to view it";
                res.redirect('/projects/list');
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, user.Id, UserProjectRole_1.UserProjectPermissions.Update))) {
                req.session.error = "Project not found or you do not have the permission to view it";
                res.redirect('/projects/list');
                return;
            }
            res.locals.viewData.project = project;
            res.locals.viewData.projectUsers = project.ProjectUsers;
            res.locals.viewData.canAssignUser = await ProjectUser_1.ProjectUser.HasPermission(projectId, user.Id, UserProjectRole_1.UserProjectPermissions.Assign);
            res.locals.viewData.unassignedUsers = await ProjectUser_1.ProjectUser.GetAllUsersNotInProject(projectId, user);
            res.render('projects/settings/assigned', res.locals.viewData);
        });
    }
}
exports.default = Assigned;
//# sourceMappingURL=assigned.js.map