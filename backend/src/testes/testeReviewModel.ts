import { DataSource } from 'typeorm';
import { Review } from '../models/Review';
import { Driver } from '../models/Driver';

export const createReviewTest = async (dataSource: DataSource, reviewDTO: Review) => {
    const reviewRepository = dataSource.getRepository(Review);
    try {
        // Salvar a revisão no banco de dados
        await reviewRepository.save(reviewDTO);
        console.log('Review adicionado com sucesso!');
        return reviewDTO;  // Retorne a revisão salva
    } catch (error) {
        // Lidar com possíveis erros ao salvar a revisão
        console.error('Erro ao adicionar review:', error);
        return null;  // Retorne null caso haja um erro ao salvar
    }
};

export const testeReview = async (dataSource: DataSource, reviewDTO: Review) => {
    try {
        const reviewRepository = dataSource.getRepository(Review);

        // Salvar o review
        const savedReview = await reviewRepository.save(reviewDTO);

        // Retornar o review salvo
        return savedReview;
    } catch (error) {
        console.error('Erro ao salvar o review:', error);
        return undefined; // Ou lance uma exceção, dependendo da lógica
    }

};
