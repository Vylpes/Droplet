import { Route } from "../../contracts/Route";
import AddNote from "./addNote";
import New from "./new";
import Update from "./update";
import UpdateQuantity from "./update-quantity";
import View from "./view";

export default class SuppliesRouters extends Route {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/:new", new New());
        this.AddPage("/:Id/update-quantity", new UpdateQuantity());
        this.AddPage("/:Id/update", new Update());
        this.AddPage("/:Id", new View());
    }
}