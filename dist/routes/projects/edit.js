"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edit = void 0;
const UserProjectRole_1 = require("../../constants/UserProjectRole");
const Page_1 = require("../../contracts/Page");
const Project_1 = require("../../entity/Project");
const ProjectUser_1 = require("../../entity/ProjectUser");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class Edit extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/edit', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            if (!(await ProjectUser_1.ProjectUser.HasPermission(req.params.projectId, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.Update))) {
                req.session.error = "Unauthorised";
                res.redirect("/projects/list");
                return;
            }
            const projectId = req.body.projectId;
            const name = req.body.name;
            const description = req.body.description;
            if (!projectId || !name || !description) {
                req.session.error = "All fields are required";
                res.redirect('/projects/list');
                return;
            }
            if (!(await Project_1.Project.EditProject(projectId, name, description, req.session.User))) {
                req.session.error = "Error editing project";
            }
            res.redirect(`/projects/view/${projectId}`);
        });
    }
}
exports.Edit = Edit;
//# sourceMappingURL=edit.js.map