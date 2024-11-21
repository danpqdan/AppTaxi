import { Driver } from "../models/Driver";
import { dataSource } from "./dataSource";

export class DriverServices {
    private driverRepository = dataSource.getRepository(Driver);

    static async getAll(): Promise<Driver[]> {
        try {
            // Usando o repositório do TypeORM para buscar todos os motoristas
            const driverRepository = dataSource.getRepository(Driver);
            const drivers = await driverRepository.find();
            return drivers;
        } catch (err) {
            console.error('Erro ao listar motoristas:', err);
            return [];
        }
    }


    static async create(driver: Driver): Promise<Driver> {
        try {
            const driverRepository = dataSource.getRepository(Driver);
            const newDriver = driverRepository.create({
                name: driver.name,
                description: driver.description,
                car: driver.car,
                tax: driver.tax,
                km_lowest: driver.km_lowest
            });

            await driverRepository.save(newDriver);

            console.log('Motorista criado com sucesso!');
            return newDriver; // Retorna o motorista criado com o id gerado automaticamente
        } catch (err) {
            console.error('Erro ao criar motorista:', err);
            throw new Error('Erro ao criar motorista');
        }
    }


    static async findById(id: number): Promise<Driver> {
        const driverRepository = dataSource.getRepository(Driver);
        const driver = await driverRepository.findOne({ where: { id } });
        if (!driver) {
            throw new Error('Driver not found');
        }
        return driver;
    }


}