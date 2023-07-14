import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { StorageType, StorageTypeNames } from "../constants/StorageType";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";

@Entity()
export class Storage extends BaseEntity {
    constructor(name: string, skuPrefix: string, storageType: StorageType) {
        super();

        this.Name = name;
        this.SkuPrefix = skuPrefix;
        this.StorageType = storageType;

        this.ItemCounter = 0;
    }

    @Column()
    Name: string;

    @Column()
    SkuPrefix: string;

    @Column()
    StorageType: StorageType;

    StorageTypeName = () => StorageTypeNames.get(this.StorageType);

    @Column()
    ItemCounter: number;

    @ManyToOne(() => Storage, storage => storage.Children)
    Parent?: Storage;

    @OneToMany(() => Storage, storage => storage.Parent)
    Children: Storage[];

    @OneToMany(() => Item, item => item.Storage)
    Items: Item[];

    public UpdateBasicDetails(name: string, storageType: StorageType) {
        this.Name = name;
        this.StorageType = storageType;
    }

    public AssignParentStorage(parent: Storage) {
        if (this.StorageType == StorageType.Building) return;

        this.Parent = parent;
    }

    public AddItemToBin(item: Item) {
        if (this.StorageType != StorageType.Bin) return;

        this.Items.push(item);
        this.ItemCounter++;
    }
}