import ApiRoute from "../../../contracts/ApiRoute";
import AddNote from "./addNote";
import List from "./list";
import New from "./new";
import Update from "./update";
import UpdateStatus from "./updateStatus";
import View from "./view";

export default class ItemPurchasesRouter extends ApiRoute {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id/update", new Update());
        this.AddPage("/view/:Id/update-status", new UpdateStatus());
        this.AddPage("/view/:Id", new View());
        this.AddPage("/:status", new List());
    }
}
