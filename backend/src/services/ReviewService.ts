import { Driver } from "../models/Driver";
import { Review } from "../models/Review";
import { ErrorInvalidRequest, SuccessResponse } from "../services/exceptionHandler/exceptionRequest";
import { dataSource } from "./DataSource";
import { DriverServices } from "./DriverService";
import { DriverNotFound } from "./exceptionHandler/exceptionDriver";

export class ReviewService {

    private static reviewRepository = dataSource.getRepository(Review);


    static async getReviewsForDriver(driverId: number): Promise<Review[]> {
        try {
            // Buscando as revisões associadas ao motorista pelo driver_id
            const reviews = await this.reviewRepository.find({
                where: { id: driverId }  // Condição para buscar revisões associadas ao driver
            });

            if (!reviews || reviews.length === 0) {
                throw new Error(`Nenhuma revisão encontrada para o motorista com ID ${driverId}.`);
            }

            return reviews; // Retorna a lista de revisões encontradas
        } catch (error) {
            console.error('Erro ao buscar revisões:', error);
            throw error;
        }
    }




    static async createReview(review: Review): Promise<SuccessResponse> {
        try {
            // Validações simples (exemplo)
            if (!review.comment || review.rating <= 1 || review.rating >= 5 || !review.driver) {
                throw new ErrorInvalidRequest
            }
            // Salvar a revisão no banco de dados
            const savedReview = await this.reviewRepository.save(review);
            const pacthReview = await DriverServices.patchDriverWithReview(review);
            console.log(savedReview, pacthReview);
            return new SuccessResponse()
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest
        }
    };

    static async createReviewScript(review: Review[]): Promise<Review[]> {
        try {
            // Usando save para salvar múltiplos registros
            return await this.reviewRepository.save(review);
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest;
        }
    }

    static async getAllReview(driver: Driver): Promise<Review[]> {
        try {
            const reviewWithTargetIfDriver = await this.reviewRepository.findBy({ id: driver.id });
            if (!reviewWithTargetIfDriver) {
                //verificar o retorno de arrays vazios...
                throw { message: "Esse é um campo de teste" }
            }
            return reviewWithTargetIfDriver
        }
        catch (error) {
            console.log(error)
            throw new DriverNotFound(driver.name)
        }
    }
}