"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assign = void 0;
const Page_1 = require("../../../contracts/Page");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
const UserProjectRole_1 = require("../../../constants/UserProjectRole");
const ProjectUser_1 = require("../../../entity/ProjectUser");
class Assign extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/assign/assign', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.body.projectId;
            const assignUserId = req.body.userId;
            const currentUser = req.session.User;
            if (!projectId) {
                req.session.error = "Project not found or you do not have permission to view it";
                res.redirect('/projects/list');
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Assign))) {
                req.session.error = "Project not found or you do not have permission to view it";
                res.redirect('/projects/list');
                return;
            }
            if (!assignUserId) {
                req.session.error = "All fields are required";
                res.redirect(`/projects/settings/assigned/${projectId}`);
                return;
            }
            const projectUser = await ProjectUser_1.ProjectUser.AssignUserToProject(projectId, assignUserId, currentUser);
            if (projectUser) {
                req.session.success = "Assigned user to project";
            }
            else {
                req.session.error = "Failed to assign user to project";
            }
            res.redirect(`/projects/settings/assigned/${projectId}`);
        });
    }
}
exports.Assign = Assign;
//# sourceMappingURL=assign.js.map