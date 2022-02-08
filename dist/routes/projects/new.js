"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const Page_1 = require("../../contracts/Page");
const Project_1 = require("../../entity/Project");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class New extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/new', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const name = req.body.name;
            const description = req.body.description;
            const taskPrefix = req.body.taskPrefix;
            if (!name || !description || !taskPrefix) {
                req.session.error = "All fields are required";
                res.redirect('/projects/list');
                return;
            }
            const project = await Project_1.Project.CreateProject(name, description, taskPrefix, req.session.User);
            if (!project) {
                req.session.error = "There was an error creating the project";
                res.redirect('/projects/list');
                return;
            }
            req.session.success = "Successfully created project";
            res.redirect(`/projects/view/${project.Id}`);
        });
    }
}
exports.New = New;
//# sourceMappingURL=new.js.map