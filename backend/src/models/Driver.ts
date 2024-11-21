import { Entity, PrimaryGeneratedColumn, Column, OneToMany, EntityRepository } from 'typeorm';
import { Review } from './Review';
import { dataSource } from '../services/dataSource';

@Entity('drivers')  // Nome da tabela no banco de dados
export class Driver {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    car: string;

    @Column('decimal')
    tax: number;

    @Column('int')
    km_lowest: number;

    @OneToMany(() => Review, (review) => review.driver, { cascade: true })
    reviews!: Review[];


    constructor(id: number, name: string, description: string, car: string, tax: number, km_lowest: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.car = car;
        this.tax = tax;
        this.km_lowest = km_lowest;
    }


}