import ApiRoute from "../../../../contracts/ApiRoute";
import RequestToken from "./requestToken";

export default class VerificationTokenRouter extends ApiRoute {
    constructor() {
        super(false);

        this.AddPage("/request", new RequestToken());
    }
}
