import { v4 } from "uuid";
import { ErrorCode } from "../../../constants/ErrorMessages";
import { Result } from "../../../contracts/Result";
import DomainHandler from "../../../core/domain/DomainHandler";
import CreateItemCommand from "../../commands/Item/CreateItemCommand";
import Item from "../../models/Item/Item";
import CreateItemCommandResult from "../../results/Item/CreateItemCommandResult";
import CreateItemCommandValidator from "../../validators/Item/CreateItemCommandValidator";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default class CreateItemCommandHandler extends DomainHandler<CreateItemCommand, CreateItemCommandValidator, CreateItemCommandResult> {
    async Handle(command: CreateItemCommand): Promise<Result<CreateItemCommandResult>> {
        if (!new CreateItemCommandValidator().Validate(command)) {
            return Result.FailWithCode(ErrorCode.StateInvalid);
        }

        const item: Item = {
            uuid: v4(),
            sku: null,
            name: command.name,
            quantities: {
                unlisted: command.quantity,
                listed: 0,
                sold: 0,
                rejected: 0,
            },
            status: ItemStatus.Unlisted,
            notes: [],
            r_storageBin: null,
        };

        const dbResult = await ConnectionHelper.InsertOne<Item>("item", item);

        if (!dbResult) {
            return Result.FailWithCode(ErrorCode.DatabaseError);;
        }

        const result: CreateItemCommandResult = {
            uuid: item.uuid,
        };

        return Result.Ok<CreateItemCommandResult>(result);
    }
}