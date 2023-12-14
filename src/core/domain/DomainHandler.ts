import { Result } from "../../contracts/Result";
import DomainCommand from "./DomainCommand";
import DomainValidator from "./DomainValidator";

export default abstract class DomainHandler<TCommand extends DomainCommand, TValidator extends DomainValidator<TCommand>, TResult> {
    abstract Handle(command: TCommand): Promise<Result<TResult>>;
}