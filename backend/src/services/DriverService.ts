import { In, LessThanOrEqual } from "typeorm";
import { Driver } from "../models/Driver";
import { Review } from "../models/Review";
import { Riders } from "../models/Riders";
import { dataSource } from "./DataSource";
import { DriverNotFound, DriverNotFoundWithId } from "./exceptionHandler/exceptionDriver";
import { ErrorInter, ErrorInvalidRequest } from "./exceptionHandler/exceptionRequest";
import { ReviewService } from "./ReviewService";

export class DriverServices {
    static driverRepository = dataSource.getRepository(Driver)

    // Inicializando o repositório após o banco de dados estar conectado

    static async getAll(): Promise<Driver[]> {
        try {
            // Usando o repositório do TypeORM para buscar todos os motoristas e carregar os reviews associados
            const listDrivers = await this.driverRepository.find({
                relations: ['reviews'], // Carrega as revisões associadas a cada motorista
            });
    
            // Retorne a lista de motoristas com os reviews
            return listDrivers;
        } catch (error) {
            console.error('Erro ao buscar motoristas com reviews:', error);
            throw new Error('Erro ao buscar motoristas');
        }
    }
    

    static async createDriverScript(drivers: Driver[]): Promise<Driver[]> {
        try {
            // Usando save para salvar múltiplos registros
            const savedDrivers = await this.driverRepository.save(drivers);
            return savedDrivers;
        } catch (error) {
            console.error('Erro ao salvar motoristas:', error);
            throw error;
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
                where: { id: review.driver },
                relations: ['reviews'],
            });

            // Verifica se o Driver foi encontrado
            if (!driverTargetForReview) {
                throw new DriverNotFoundWithId(review.driver);
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

    static async getDriversWithReviews(drivers: Driver[]) {
        try {
            // Busca todos os motoristas com suas respectivas revisões de uma vez
            const driversWithReviews = await this.driverRepository.find({
                where: { id: In(drivers.map(driver => driver.id)) },
                relations: ['reviews'],  // Carrega as revisões junto
            });

            return driversWithReviews;  // Retorna a lista de motoristas com suas revisões
        } catch (error) {
            console.error('Erro ao buscar motoristas com revisões:', error);
            throw error;
        }
    }




    static async findForKmLowest(rider: Riders): Promise<Driver[]> {
        const drivers = await this.driverRepository.find({
            where: { km_lowest: LessThanOrEqual(rider.distance) },
            relations: ['reviews'], // Carrega as revisões associadas aos motoristas
        });

        // Verificando se não há motoristas
        if (drivers.length === 0) {
            throw new DriverNotFound("Nenhum motorista encontrado para o KM_Low.");
        }
        // Processando os motoristas e suas revisões
        const sortedDrivers = await Promise.all(
            drivers
                .sort((a, b) => a.km_lowest - b.km_lowest) // Ordenando os motoristas pelo km_lowest
                .map(async (driver) => {
                    // Criando uma instância de Driver com as informações necessárias, incluindo as revisões
                    const driverInstance = new Driver(
                        driver.name,
                        driver.description || '', // Garantindo que 'description' tenha um valor
                        driver.car,
                        driver.tax,
                        driver.km_lowest,
                    );

                    // Buscando as revisões do motorista de forma assíncrona
                    const reviews = await ReviewService.getReviewsForDriver(driver.id);
                    reviews.forEach(review => {
                        console.log(`Review para o motorista ${driver.name}: ${review.comment}`);
                    });

                    // Associando as revisões encontradas à instância do motorista
                    driverInstance.reviews = reviews;

                    // Retornando a instância do motorista
                    return driverInstance;
                })
        );

        return sortedDrivers;

    } catch() {
        throw new ErrorInter;
    }
}




