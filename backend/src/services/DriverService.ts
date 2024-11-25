import { Riders } from "models/Riders";
import { Driver } from "../models/Driver";
import { Review } from "../models/Review";
import { dataSource } from "./DataSource";
import { DriverNotFound, DriverNotFoundWithId } from "./exceptionHandler/exceptionDriver";
import { ErrorInter, ErrorInvalidRequest } from "./exceptionHandler/exceptionRequest";
import { promises } from "dns";
import { LessThanOrEqual } from "typeorm";

export class DriverServices {
    static driverRepository = dataSource.getRepository(Driver)

    // Inicializando o repositório após o banco de dados estar conectado

    static async getAll(): Promise<Driver[]> {
        try {
            // Usando o repositório do TypeORM para buscar todos os motoristas
            const listDrivers = await this.driverRepository.find();
            if (!listDrivers) {
                throw new DriverNotFound('Driver')
            }
            return listDrivers;
        } catch (err) {
            console.error(err);
            throw new ErrorInter;
        }
    }


    static async createDriver(driver: Driver): Promise<Driver> {
        try {
            const newDriver = {
                id: driver.id,
                name: driver.name,
                description: driver.description,
                car: driver.car,
                tax: driver.tax,
                km_lowest: driver.km_lowest,
            }

            await this.driverRepository.create(driver);
            if (!newDriver) {
                throw new ErrorInvalidRequest
            }
            const savedDriver = await this.driverRepository.save(newDriver);
            console.log('Driver saved success');
            return savedDriver
        } catch (err) {
            console.error(err);
            throw new ErrorInter;
        }
    }


    static async findById(id: number): Promise<Driver> {
        try {
            const driver = await this.driverRepository.findOne({ where: { id } });
            if (!driver) {
                throw new DriverNotFoundWithId(id)
            }
            return driver;
        } catch (err) {
            console.log(err)
            throw new ErrorInvalidRequest
        }
    }

    static async findByName(name: string): Promise<Driver> {
        try {
            const driver = await this.driverRepository.findOneBy({ name: name });
            if (!driver) {
                throw new DriverNotFound(name)
            }
            return driver;
        } catch (err) {
            console.log(err)
            throw new ErrorInvalidRequest
        }
    }

    static async patchDriverWithReview(review: Review): Promise<Driver> {
        try {
            const driverTargetForReview = await this.driverRepository.findOne({
                where: { id: review.driver.id },
                relations: ['reviews'],
            });

            // Verifica se o Driver foi encontrado
            if (!driverTargetForReview) {
                throw new DriverNotFoundWithId(review.driver.id);
            }

            // Adiciona a nova Review ao array de reviews do Driver
            if (!driverTargetForReview.reviews) {
                driverTargetForReview.reviews = [];
            }
            driverTargetForReview.reviews.push(review);

            // Salva o Driver atualizado
            return await this.driverRepository.save(driverTargetForReview);
        }
        catch (error) {
            console.log(error)
            throw new ErrorInter
        }
    }

    static async findForKmLowest(rider: Riders): Promise<Driver[]> {
        try {
            const drivers = await this.driverRepository.find({
                where: { km_lowest: LessThanOrEqual(rider.distance) }
            })
            if (drivers.length == 0) {
                throw new DriverNotFound("KM_Low in moment")
            }
            drivers.sort((a, b) => a.km_lowest - b.km_lowest);
            return drivers
        } catch (error) {
            console.log(error)
            throw new ErrorInter
        }
    }
}