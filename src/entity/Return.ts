import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ReturnStatus, ReturnStatusNames } from "../constants/Status/ReturnStatus";
import { TrackingNumberType } from "../constants/TrackingNumberType";
import BaseEntity from "../contracts/BaseEntity";
import SettingsHelper from "../helpers/SettingsHelper";
import { Order } from "./Order";
import { TrackingNumber } from "./TrackingNumber";

@Entity()
export class Return extends BaseEntity {
    constructor(returnNumber: string, rma: string) {
        super();

        this.ReturnNumber = returnNumber;
        this.RMA = rma;

        this.Status = ReturnStatus.Opened;
        this.ReturnBy = new Date();
        this.RefundAmount = 0;
    }

    @Column()
    ReturnNumber: string;

    @Column()
    RMA: string;

    @Column()
    ReturnBy: Date

    @Column()
    Status: ReturnStatus;

    StatusName = () => ReturnStatusNames.get(this.Status);

    @Column("decimal", { precision: 20, scale: 2 })
    RefundAmount: number;

    @OneToMany(() => TrackingNumber, trackingNumber => trackingNumber.Return)
    TrackingNumbers: TrackingNumber[];

    @ManyToOne(() => Order, item => item.Returns)
    Order: Order;

    public UpdateBasicDetails(returnNumber: string, rma: string, returnBy: Date) {
        this.ReturnNumber = returnNumber;
        this.RMA = rma;
        this.ReturnBy = returnBy;
    }

    public AssignOrderToReturn(order: Order) {
        this.Order = order;
    }

    public AssignTrackingNumber(trackingNumber: TrackingNumber) {
        if (trackingNumber.Type != TrackingNumberType.Return) return;

        this.TrackingNumbers.push(trackingNumber);
    }

    public MarkAsStarted(refundBy: Date) {
        this.Status = ReturnStatus.Started;
        this.ReturnBy = refundBy;
    }

    public MarkAsPosted() {
        this.Status = ReturnStatus.ItemPosted;
    }

    public MarkAsReceived(refundBy: Date) {
        this.Status = ReturnStatus.ItemReceived;
        this.ReturnBy = refundBy;
    }

    public MarkAsRefunded(refundAmount: number) {
        this.Status = ReturnStatus.Refunded;
        this.ReturnBy = new Date();
        this.RefundAmount = refundAmount;
    }

    public MarkAsClosed() {
        this.Status = ReturnStatus.Closed;
        this.ReturnBy = new Date();
    }

    public static async GenerateRMA(): Promise<string> {
        const date = new Date();

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const count = Number(await SettingsHelper.GetSetting("return.count"));

        await SettingsHelper.SetSetting("return.count", String(count + 1));

        return `${String(year).padStart(4, '0')}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(count).padStart(4, '0')}`; // YYYYMMDD-0000
    }
}