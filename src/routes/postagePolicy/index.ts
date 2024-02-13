import { Route } from "../../contracts/Route";
import Archive from "./archive";
import List from "./list";
import New from "./new";
import Update from "./update";
import View from "./view";

export default class PostagePolicyRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/:Id/archive", new Archive());
        this.AddPage("/", new List());
        this.AddPage("/new", new New());
        this.AddPage("/:id/update", new Update());
        this.AddPage("/:id", new View());
    }
}