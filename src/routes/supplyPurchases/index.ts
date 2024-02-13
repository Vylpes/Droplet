import { Route } from "../../contracts/Route";
import AddNote from "./addNote";
import List from "./list";
import New from "./new";
import Update from "./update";
import UpdateStatus from "./updateStatus";
import View from "./view";

export default class SupplyPurchasesRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/:status", new List());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id/update", new Update());
        this.AddPage("/view/:Id/update-status", new UpdateStatus());
        this.AddPage("/view/:Id", new View());
    }
}