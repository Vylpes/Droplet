import ApiRoute from "../../../../contracts/ApiRoute";
import RequestToken from "./requestToken";
import Reset from "./reset";

export default class PasswordResetRouter extends ApiRoute {
    constructor() {
        super(false);

        this.AddPage("/request", new RequestToken());
        this.AddPage("/reset", new Reset());
    }
}
