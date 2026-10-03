import ApiRoute from "../../../contracts/ApiRoute";
import AdminRegister from "./adminRegister";
import Login from "./login";
import Logout from "./logout";
import Me from "./me";
import PasswordResetRouter from "./passwordReset";
import VerificationTokenRouter from "./verificationToken";
import Verify from "./verify";

export default class AuthRouter extends ApiRoute {
    constructor() {
        // Public auth endpoints — session cookies via credentials: 'include'
        super(false);

        this.AddSubRoute("/password-reset", new PasswordResetRouter());
        this.AddSubRoute("/verification-token", new VerificationTokenRouter());

        this.AddPage("/admin-register", new AdminRegister());
        this.AddPage("/login", new Login());
        this.AddPage("/logout", new Logout());
        this.AddPage("/me", new Me());
        this.AddPage("/verify", new Verify());
    }
}
