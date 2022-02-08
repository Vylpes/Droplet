"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../../contracts/Page");
const User_1 = require("../../../entity/User");
const userMiddleware_1 = require("../../../middleware/userMiddleware");
class Account extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/settings/account', userMiddleware_1.UserMiddleware.Authorise, (req, res) => {
            const user = req.session.User;
            res.locals.viewData.user = user;
            res.render('user/settings/account', res.locals.viewData);
        });
    }
    OnPost() {
        super.router.post('/settings/account', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const user = req.session.User;
            const email = req.body.email;
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;
            const passwordConfirm = req.body.passwordConfirm;
            const username = req.body.username;
            if (!email || !currentPassword || !username) {
                req.session.error = "Email, Current Password, and Username are required";
                res.redirect('/user/settings/account');
                return;
            }
            if (!await User_1.User.IsLoginCorrect(user.Email, currentPassword)) {
                req.session.error = "Your password was incorrect";
                res.redirect('/user/settings/account');
                return;
            }
            if (newPassword && (newPassword != passwordConfirm)) {
                req.session.error = "Passwords must match";
                res.redirect('/user/settings/account');
                return;
            }
            const result = await User_1.User.UpdateCurrentUserDetails(user, email, username, newPassword ? newPassword : currentPassword);
            if (result.IsSuccess) {
                const newUser = await User_1.User.GetUser(user.Id);
                req.session.User = newUser;
                req.session.success = "Saved successfully";
            }
            else {
                req.session.error = result.Message;
            }
            res.redirect('/user/settings/account');
        });
    }
}
exports.default = Account;
//# sourceMappingURL=account.js.map