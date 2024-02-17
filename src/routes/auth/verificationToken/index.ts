import Route from "../../../contracts/Route";
import RequestToken from "./requestToken";

export default class verificationTokenRouter extends Route {
    constructor() {
        super();

        this.AddPage('/request', new RequestToken());
    }
}