import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Riders } from "./Riders";

@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn()
    customer_id!: string;
    @OneToMany(() => Riders, (ride) => ride.costumerId, { cascade: true })
    rides?: Riders[] | Riders;

    constructor(customer_id: string, rides: Riders[] | Riders) {
        this.customer_id = customer_id;
        this.rides = rides;
    }
}
