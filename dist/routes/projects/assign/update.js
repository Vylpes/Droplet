"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = void 0;
const Page_1 = require("../../../contracts/Page");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
const ProjectUser_1 = require("../../../entity/ProjectUser");
const UserProjectRole_1 = require("../../../constants/UserProjectRole");
class Update extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/assign/update', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.body.projectId;
            const assignedUserId = req.body.userId;
            const currentUser = req.session.User;
            if (!projectId) {
                req.session.error = "Project not found or you are not authorised to see it";
                res.redirect('/projects/list');
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Assign))) {
                req.session.error = "Project not found or you are not authoirsed to see it";
                res.redirect('/projects/list');
                return;
            }
            if (!assignedUserId) {
                req.session.error = "All fields are required";
                res.redirect(`/projects/settings/assigned/${projectId}`);
                return;
            }
            const result = await ProjectUser_1.ProjectUser.ToggleAdmin(projectId, assignedUserId, currentUser);
            if (result) {
                req.session.success = "Successfully updated user";
            }
            else {
                req.session.error = "An error occurred. Please try again.";
            }
            res.redirect(`/projects/settings/assigned/${projectId}`);
        });
    }
}
exports.Update = Update;
//# sourceMappingURL=update.js.map