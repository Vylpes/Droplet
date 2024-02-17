import Route from "../../contracts/Route";
import AssignItem from "./assignItem";
import New from "./new";
import View from "./view";

export default class StorageRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/view/:Id/assign-item", new AssignItem());
        this.AddPage("/list/:type/:id", new AssignItem());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id", new View());
    }
}