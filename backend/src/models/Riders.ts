import { format } from "date-fns";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Driver } from "./Driver";

@Entity('rides')
export class Riders {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column('datetime')
    date: Date;
    @Column()
    origin: string;
    @Column()
    destination: string;
    @Column('int')
    distance: number;
    @Column()
    duration: string;
    @Column('decimal')
    value?: number;
    @ManyToOne(() => Client, (cliente) => cliente.customer_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;
    @OneToOne(() => Driver, (driver) => driver.id, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'driver_id' })
    driver?: Driver;

    constructor(origin: string, destination: string, distance: number, duration: string, client: Client) {
        this.date = new Date(format(new Date(), 'dd-MM-yyyy HH:mm:ss'));
        this.origin = origin;
        this.destination = destination;
        this.distance = distance;
        this.duration = duration;
        this.client = client;
    }
}

