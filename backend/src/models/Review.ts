import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from './Driver';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('int')
    rating!: number;

    @Column('text')
    comment!: string;

    @ManyToOne(() => Driver, (driver) => driver.reviews)
    @JoinColumn({ name: 'driver_id' })
    driver!: number;

    constructor(id: number, rating: number, comment: string, driver: number) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.driver = driver;
    }

}

