import { ValidationRule } from "../../../constants/ValidationRule";
import DomainValidator from "../../../core/domain/DomainValidator";
import CreateItemCommand from "../../commands/Item/CreateItemCommand";

export default class CreateItemCommandValidator extends DomainValidator<CreateItemCommand> {
    constructor() {
        super();

        this.NotEmpty("name");
        this.MinLength("quantity", 1);
    }
}