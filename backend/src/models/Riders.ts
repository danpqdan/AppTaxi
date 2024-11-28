import { format } from "date-fns";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { Driver } from "./Driver";

@Entity('rides')
export class Riders {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column('datetime')
    date: string;
    @Column()
    origin!: string;
    @Column()
    destination!: string;
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    distance!: number;
    @Column()
    duration!: string;
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    value?: number;
    @ManyToOne(() => Customer, (customer) => customer.customer_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'costumer_id' })
    costumerId!: number;
    @OneToOne(() => Driver, (driver) => driver.id, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'driver_id' })
    driver?: number | 0;

    constructor(origin: string, destination: string, distance: number, duration: string, customerId: number, value: number) {
        const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.date = formattedDate;
        this.costumerId = customerId;
        this.origin = origin;
        this.destination = destination;
        this.distance = distance;
        this.duration = duration;
        this.value = value;
    }
}

