import { Column, Entity, ManyToOne } from "typeorm";
import { PostalService, PostalServiceNames } from "../constants/PostalService";
import { TrackingNumberType } from "../constants/TrackingNumberType";
import BaseEntity from "../contracts/BaseEntity";
import { Order } from "./Order";
import { Return } from "./Return";

@Entity()
export class TrackingNumber extends BaseEntity {
    constructor(number: string, service: PostalService, type: TrackingNumberType) {
        super();

        this.Number = number;
        this.Service = service;
        this.Type = type;
    }

    @Column()
    Number: string;

    @Column()
    Service: PostalService;

    ServiceName = () => PostalServiceNames.get(this.Service);

    @Column()
    Type: TrackingNumberType;

    @ManyToOne(_ => Order, order => order.TrackingNumbers)
    Order: Order;

    @ManyToOne(() => Return, ret => ret.TrackingNumbers)
    Return: Return;

    public EditBasicDetails(number: string, service: PostalService) {
        this.Number = number;
        this.Service = service;

        this.WhenUpdated = new Date();
    }
}