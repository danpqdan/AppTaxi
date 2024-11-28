import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Riders } from "./Riders";
@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    customer_id!: string;

    @OneToMany(() => Riders, (ride) => ride.costumerId, { cascade: true })
    rides?: Riders[];

    constructor(customer_id: string) {
        this.customer_id = customer_id;
    }
}
