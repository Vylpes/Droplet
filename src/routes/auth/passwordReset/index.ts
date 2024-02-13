import { Route } from "../../../contracts/Route";
import RequestToken from "./requestToken";
import Reset from "./reset";

export default class PasswordResetRouter extends Route {
    constructor() {
        super();

        this.AddPage('/request', new RequestToken());
        this.AddPage('/reset', new Reset());
    }
}