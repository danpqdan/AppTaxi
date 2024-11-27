import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';

@Entity('drivers')  // Nome da tabela no banco de dados
export class Driver {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description?: string | "";

    @Column()
    car: string;

    @Column('double', { scale: 2 })
    tax: number;

    @Column('int')
    km_lowest: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    value?: number;

    @OneToMany(() => Review, (review) => review.driver, { cascade: true })
    reviews?: Review[];


    constructor(name: string, description: string, car: string, tax: number, km_lowest: number) {
        this.name = name;
        this.description = description;
        this.car = car;
        this.tax = tax;
        this.km_lowest = km_lowest;
    }

    setValue(distance: number, tax: number) {
        if (!distance) return 0;
        this.value = distance * tax;
        return this.value;
    }



}