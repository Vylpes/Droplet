import { Route } from "../../contracts/Route";
import AdminRegister from "./adminRegister";
import Login from "./login";
import Logout from "./logout";
import PasswordResetRouter from "./passwordReset";
import verificationTokenRouter from "./verificationToken";
import Verify from "./verify";

export default class AuthRouter extends Route {
    constructor() {
        super();

        this.AddSubRoute('/password-reset', new PasswordResetRouter());
        this.AddSubRoute('/verification-token', new verificationTokenRouter());

        this.AddPage("/admin-register", new AdminRegister());
        this.AddPage("/login", new Login());
        this.AddPage("/logout", new Logout());
        this.AddPage("/verify", new Verify());
    }
}