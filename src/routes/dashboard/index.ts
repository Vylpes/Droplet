import { Route } from "../../contracts/Route";
import Calculator from "./calculator";
import { Index } from "./indexPage";

export class DashboardRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/", new Index());
        this.AddPage("/calculator", new Calculator());
    }
}