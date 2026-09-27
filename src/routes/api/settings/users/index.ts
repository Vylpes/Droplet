import ApiRoute from "../../../../contracts/ApiRoute";
import Create from "./create";
import List from "./list";
import ToggleActive from "./toggleActive";
import Update from "./update";
import View from "./view";

export default class UsersRouter extends ApiRoute {
    constructor() {
        super(true, true);

        this.AddPage("/create", new Create());
        this.AddPage("/", new List());
        this.AddPage("/:id/toggle-active", new ToggleActive());
        this.AddPage("/:id/update", new Update());
        this.AddPage("/:id", new View());
    }
}
