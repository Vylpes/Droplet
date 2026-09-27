import ApiRoute from "../../../contracts/ApiRoute";
import AssignItem from "./assignItem";
import List from "./list";
import New from "./new";
import View from "./view";

export default class StorageRouter extends ApiRoute {
    constructor() {
        super(true);

        this.AddPage("/view/:Id/assign-item", new AssignItem());
        this.AddPage("/list/:type/:id", new List());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id", new View());
    }
}
