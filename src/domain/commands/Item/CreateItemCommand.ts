import DomainCommand from "../../../core/domain/DomainCommand";

export default interface CreateItemCommand extends DomainCommand {
    name: string,
    quantity: number,
}