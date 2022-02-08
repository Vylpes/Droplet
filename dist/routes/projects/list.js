"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Page_1 = require("../../contracts/Page");
const Project_1 = require("../../entity/Project");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class List extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/list', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            res.locals.viewData.projects = await Project_1.Project.GetAllProjects(req.session.User);
            res.render('projects/list', res.locals.viewData);
        });
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map