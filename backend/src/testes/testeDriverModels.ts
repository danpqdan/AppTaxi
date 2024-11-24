import { DataSource } from 'typeorm';
import { Driver } from '../models/Driver'; // Import do modelo Driver

export const ArrayDriversTest: Driver[] = [
    {
        id: 1,
        name: 'Homer Simpson',
        description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        car: 'Plymouth Valiant 1973 rosa e enferrujado',
        tax: 2.5,
        km_lowest: 1,
    }, {
        id: 2,
        name: 'Dominic Toretto',
        description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
        car: 'Dodge Charger R/T 1970 modificado',
        tax: 5.0000,
        km_lowest: 5
    }, {
        id: 3,
        name: 'James Bond',
        description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
        car: 'Aston Martin DB5 clássico',
        tax: 10.00000,
        km_lowest: 10
    }];
export const testeDriver = async (dataSource: DataSource) => {
    const driverRepository = dataSource.getRepository(Driver);
    try {
        const savedDriver = driverRepository.save(ArrayDriversTest);
        if (savedDriver != null) {
            console.log('Homer Simpson foi adicionado com sucesso!');
            return savedDriver;
        }
        console.log('Erro ao adicionar motorista')
    } catch (error) {
        console.error('Erro ao chamar o servico:', error);
    }
};
