import ApiRoute from "../../../contracts/ApiRoute";
import Index from "./indexPage";

export default class DashboardRouter extends ApiRoute {
    constructor() {
        super(true);

        this.AddPage("/", new Index());
    }
}
