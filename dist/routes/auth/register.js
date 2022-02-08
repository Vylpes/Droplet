"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const Page_1 = require("../../contracts/Page");
const User_1 = require("../../entity/User");
class Register extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/register', async (req, res) => {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const passwordRepeat = req.body.passwordRepeat;
            if (!username || !email || !password || !passwordRepeat) {
                req.session.error = "All fields are required";
                res.redirect('/auth/login');
                return;
            }
            if (password.length < 7) {
                req.session.error = "Password must be greater than 7 characters in length";
                res.redirect('/auth/login');
                return;
            }
            if (password != passwordRepeat) {
                req.session.error = "Passwords do not match";
                res.redirect('/auth/login');
                return;
            }
            if (await User_1.User.RegisterUser(username, email, password, passwordRepeat)) {
                req.session.success = "You are now registered";
                res.redirect('/auth/login');
                return;
            }
            req.session.error = "Failed to register user. Please try again";
            res.redirect('/auth/login');
        });
    }
}
exports.Register = Register;
//# sourceMappingURL=register.js.map