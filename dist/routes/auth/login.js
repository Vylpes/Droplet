"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const Page_1 = require("../../contracts/Page");
const User_1 = require("../../entity/User");
class Login extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/login', (req, res) => {
            if (res.locals.viewData.isAuthenticated) {
                res.redirect('/dashboard');
                return;
            }
            res.render('auth/login', res.locals.viewData);
        });
    }
    OnPost() {
        super.router.post('/login', async (req, res) => {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                req.session.error = "All fields are required";
                res.redirect('/auth/login');
                return;
            }
            if (await User_1.User.IsLoginCorrect(email, password)) {
                req.session.regenerate(async () => {
                    const user = await User_1.User.GetUserByEmailAddress(email);
                    req.session.User = user;
                    res.redirect('/dashboard');
                });
            }
            else {
                req.session.error = "Password is incorrect";
                res.redirect('/auth/login');
            }
        });
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map