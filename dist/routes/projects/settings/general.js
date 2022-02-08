"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../../contracts/Page");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
const ProjectUser_1 = require("../../../entity/ProjectUser");
const UserProjectRole_1 = require("../../../constants/UserProjectRole");
const Project_1 = require("../../../entity/Project");
class General extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get("/settings/general/:projectId", userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.params.projectId;
            if (!projectId) {
                req.session.error = "Project not found or you do not have permissions to view it";
                res.redirect("/projects/list");
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.Update))) {
                req.session.error = "Project not found or you do not have permissions to view it";
                res.redirect("/projects/list");
                return;
            }
            const project = await Project_1.Project.GetProject(projectId, req.session.User);
            if (!project) {
                req.session.error = "Project not found or you do not have permissions to view it";
                res.redirect("/projects/list");
                return;
            }
            res.locals.viewData.project = project;
            res.render('projects/settings/general', res.locals.viewData);
        });
    }
    OnPost() {
        super.router.post("/settings/general/:projectId", userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const projectId = req.params.projectId;
            const name = req.body.name;
            const description = req.body.description;
            if (!projectId) {
                req.session.error = "Project not found or you do not have permissions to view it";
                res.redirect("/projects/list");
                return;
            }
            if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, req.session.User.Id, UserProjectRole_1.UserProjectPermissions.Update))) {
                req.session.error = "Project not found or you do not have permissions to view it";
                res.redirect("/projects/list");
                return;
            }
            if (!name || !description) {
                req.session.error = "All fields are required";
                res.redirect(`/projects/settings/general/${projectId}`);
                return;
            }
            const result = await Project_1.Project.EditProject(projectId, name, description, req.session.User);
            if (result) {
                req.session.success = "Successfully updated project";
            }
            else {
                req.session.error = "There was an error updating the project";
            }
            res.redirect(`/projects/settings/general/${projectId}`);
        });
    }
}
exports.default = General;
//# sourceMappingURL=general.js.map