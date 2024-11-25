import { SuccessResponse } from '../services/exceptionHandler/exceptionRequest';
import { Driver } from '../models/Driver';
import { Review } from '../models/Review';
import { dataSource } from '../services/DataSource';
import { DriverServices } from '../services/DriverService';
import { ReviewService } from '../services/ReviewService';
import { ArrayDriversTest } from '../database/ScriptDriver';

describe('testeDriver e testeReview', () => {
    beforeAll(async () => {
        await dataSource.initialize();
        console.log('DataSource initialized for testing');

    });



    // // Limpa os dados após cada teste
    afterEach(async () => {


        await dataSource.getRepository(Driver).clear;
        await dataSource.getRepository(Review).clear;
    });

    // Fecha a conexão após os testes
    afterAll(async () => {
        await dataSource.destroy();
        console.log('DataSource destroyed after tests');
    });

    it('deve adicionar Homer Simpson com sucesso', async () => {

        const createdDriver = await DriverServices.createDriver(ArrayDriversTest[0]);
        expect(createdDriver).toBeDefined();
        expect(createdDriver!.name).toBe('Homer Simpson');
        console.log('Driver inserido:', createdDriver); // Verifique o que foi retornado

        const homer = await DriverServices.findByName("Homer Simpson");

        // Verifica se o Homer foi adicionado corretamente
        expect(homer).toBeDefined();
        expect(homer!.name).toBe('Homer Simpson');
        expect(homer!.description).toContain('Olá! Sou o Homer');
        expect(homer!.car).toBe('Plymouth Valiant 1973 rosa e enferrujado');
        expect(homer!.tax).toBe(2.50);

    });

    it('deve adicionar múltiplos motoristas com sucesso', async () => {
        // Adiciona motoristar em massa
        // Verifica se cada motorista foi adicionado corretamente
        for (const driverData of ArrayDriversTest) {
            await DriverServices.createDriver(driverData); // Adiciona cada motorista

        }
        for (const driverData of ArrayDriversTest) {
            const driver = await DriverServices.findByName(driverData.name);
            console.log('Motorista inserido:', driver);
            expect(driver).toBeDefined();
            expect(driver!.name).toBe(driverData.name);
            expect(decodeURIComponent(driver!.description)).toContain(driverData.description);
            expect(driver!.car).toBe(driverData.car);
            expect(driver!.tax).toBe(driverData.tax);
        }
        const allDrivers = await DriverServices.getAll();
        expect(allDrivers.length).toBe(ArrayDriversTest.length);
    });


    it('deve adicionar um Review para Homer Simpson com sucesso', async () => {
        await DriverServices.createDriver(ArrayDriversTest[0]);
        await DriverServices.createDriver(ArrayDriversTest[1]);

        const homer = await DriverServices.findById(1);
        const toretto = await DriverServices.findById(2);
        // Verifica se o homer realmente foi encontrado
        expect(homer).toBeDefined();
        expect(toretto).toBeDefined();

        const arrayReviewTest = new Review(0, 2, 'Motorista simpático, mas errou o caminho 3 vezes.', homer)
        console.log(arrayReviewTest)
        // função de serviço que realiza a verificação, salva e retorna o review
        // Cria a avaliação (Review) com o motorista Homer
        const review = await ReviewService.createReview(arrayReviewTest);
        expect(review).toBeInstanceOf(SuccessResponse);
        expect(review.message).toBe('Review criada com sucesso!');

        const savedReview = await ReviewService.getAllReview(homer);
        expect(savedReview).not.toBeNull(); // Assegura que o review foi encontrado
        expect(savedReview).toBeDefined();
        savedReview!.forEach((review) => {
            expect(review).toBeInstanceOf(Review);
            expect(savedReview!.some((review) => review.comment === 'Motorista simpático, mas errou o caminho 3 vezes.')).toBe(true);
            expect(savedReview!.some((review) => review.id === homer!.id)).toBe(true);
        });


    });

})