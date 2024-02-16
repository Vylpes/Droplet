import { Route } from "../../contracts/Route";
import Index from "./indexPage";

export default class IndexRouter extends Route {
    constructor() {
        super();

        this.AddPage("/", new Index());
    }
}