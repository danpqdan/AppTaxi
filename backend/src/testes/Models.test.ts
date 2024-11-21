import { DataSource } from 'typeorm';
import { Driver } from '../models/Driver'; // Seu modelo Driver
import { Review } from '../models/Review';
import { ArrayDriversTest, testeDriver } from './testeDriverModels';
import { testeReview } from './testeReviewModel';

describe('testeDriver e testeReview', () => {
    let dataSource: DataSource;

    // Configura o banco de dados de teste antes de rodar os testes
    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: false,
            entities: [Driver, Review],
        });

        await dataSource.initialize();
    });

    // Limpa os dados após cada teste
    afterEach(async () => {
        const driverRepository = dataSource.getRepository(Driver);
        const reviewRepository = dataSource.getRepository(Review);
        await driverRepository.clear(); // Limpa os dados de Driver
        await reviewRepository.clear(); // Limpa os dados de Review
    });

    // Fecha a conexão após os testes
    afterAll(async () => {
        await dataSource.destroy();
    });

    it('deve adicionar Homer Simpson com sucesso', async () => {
        // Chama o método que você quer testar para o Driver
        await testeDriver(dataSource);

        const driverRepository = dataSource.getRepository(Driver);
        const homer = await driverRepository.findOneBy({ name: 'Homer Simpson' });
        console.log(homer)

        // Verifica se o Homer foi adicionado corretamente
        expect(homer).toBeDefined();
        expect(homer!.name).toBe('Homer Simpson');
        expect(decodeURIComponent(homer!.description)).toContain('Olá! Sou o Homer');
        expect(homer!.car).toBe('Plymouth Valiant 1973 rosa e enferrujado');
        expect(homer!.tax).toBe(2.5);
    });

    it('deve adicionar múltiplos motoristas com sucesso', async () => {
        const driverRepository = dataSource.getRepository(Driver);

        // Cria os motoristas em massa
        await driverRepository.save(ArrayDriversTest);

        // Verifica se cada motorista foi adicionado corretamente
        for (const driverData of ArrayDriversTest) {
            const driver = await driverRepository.findOneBy({ name: driverData.name });
            console.log('Motorista inserido:', driver);

            expect(driver).toBeDefined();
            expect(driver!.name).toBe(driverData.name);
            expect(decodeURIComponent(driver!.description)).toContain(driverData.description);
            expect(driver!.car).toBe(driverData.car);
            expect(driver!.tax).toBe(driverData.tax);
        }
    });


    it('deve adicionar um Review para Homer Simpson com sucesso', async () => {
        const driverRepository = dataSource.getRepository(Driver);
        const reviewRepository = dataSource.getRepository(Review);
        await driverRepository.save(ArrayDriversTest);

        const homer = await driverRepository.findOneBy({ name: 'Homer Simpson' });
        // Verifica se o homer realmente foi encontrado
        expect(homer).toBeDefined();

        const arrayReviewTest = new Review(0, 2, 'Motorista simpático, mas errou o caminho 3 vezes.', homer!)
        console.log(arrayReviewTest)
        // função de serviço que realiza a verificação, salva e retorna o review
        // Cria a avaliação (Review) com o motorista Homer
        const review = await testeReview(dataSource, arrayReviewTest);
        console.log(review);

        const savedReview = await reviewRepository.findOne({
            where: { id: review?.id },
            relations: ['driver'],
        });
        // Verifica se a revisão foi salva corretamente
        expect(savedReview).not.toBeNull(); // Assegura que o review foi encontrado
        expect(savedReview).toBeDefined();
        expect(savedReview!.rating).toBe(2);
        expect(savedReview!.comment).toBe('Motorista simpático, mas errou o caminho 3 vezes.');
        expect(savedReview!.driver.id).toBe(homer!.id);
    });



});
