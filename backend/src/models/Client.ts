import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Riders } from "./Riders";

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    customer_id!: number;
    @OneToMany(() => Riders, (ride) => ride.client, { cascade: true })
    rides: Riders[];

    constructor(customer_id: number, rides: Riders[]) {
        this.customer_id = customer_id;
        this.rides = rides;
    }
}
