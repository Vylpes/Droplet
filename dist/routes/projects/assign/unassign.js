"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unassign = void 0;
const UserProjectRole_1 = require("../../../constants/UserProjectRole");
const Page_1 = require("../../../contracts/Page");
const ProjectUser_1 = require("../../../entity/ProjectUser");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
class Unassign extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/assign/unassign', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.body.projectId;
            const unassignUserId = req.body.userId;
            const currentUser = req.session.User;
            if (!projectId) {
                req.session.error = "Project not found or you do not have permission to see it";
                res.redirect('/projects/list');
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Assign))) {
                req.session.error = "Project not found or you do not have permission to see it";
                res.redirect("/projects/list");
                return;
            }
            if (!unassignUserId) {
                req.session.error = "All fields are required";
                res.redirect(`/projects/settings/assigned/${projectId}`);
                return;
            }
            const result = await ProjectUser_1.ProjectUser.UnassignUserFromProject(projectId, unassignUserId, currentUser);
            if (result) {
                req.session.success = "Unassigned user from project";
            }
            else {
                req.session.error = "There was an error";
            }
            res.redirect(`/projects/settings/assigned/${projectId}`);
        });
    }
}
exports.Unassign = Unassign;
//# sourceMappingURL=unassign.js.map