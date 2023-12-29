import { ReturnStatus } from "../../../constants/Status/ReturnStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Return from "../../models/Return/Return";

export default async function GetAllReturnsByStatus(status: ReturnStatus): Promise<Return[]> {
    const returnsMaybe = await ConnectionHelper.FindMultiple<Return>("return", { status });

    if (!returnsMaybe.IsSuccess) {
        return;
    }

    const returns = returnsMaybe.Value;

    return returns;
}