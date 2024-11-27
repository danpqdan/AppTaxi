import mysql from 'mysql2'
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Customer } from '../models/Customer';
import { Driver } from '../models/Driver';
import { Review } from '../models/Review';
import { Riders } from '../models/Riders';

// Carregar o .env do backend
dotenv.config({ path: './app/.env' }); // Caminho para o .env docker
console.log(process.env.DB_HOST); // Deve imprimir "db"
console.log(process.env.DB_USERNAME); // Deve imprimir "admin"

const isTestEnv = process.env.NODE_ENV === 'test';

// export const dataSource = new DataSource({
//   type: 'mysql',
//   host: 'localhost',  // Endereço local do banco de dados
//   port: 3306,  // Porta padrão do MySQL
//   username: 'root',  // Usuário do banco de dados local
//   password: 'admin',  // Senha do banco de dados local
//   database: 'app_taxi',  // Nome do banco de dados local
//   charset: 'utf8mb4_unicode_ci',  // Charset, ajustado para compatibilidade
//   synchronize: true,  // Atenção ao usar em produção, pois pode alterar esquemas automaticamente
//   logging: true,  // Habilita o log das queries SQL para depuração
//   dropSchema: false,  // Evita que o esquema do banco seja apagado
//   entities: [Driver, Review, Riders, Customer],  // Entidades que você está utilizando
// });


// Antes de inicializar o DataSource, garanta que o banco exista

export const dataSource = new DataSource(
  {
    type: 'mysql',
    host: isTestEnv ? process.env.TEST_DB_HOST : process.env.DB_HOST,
    port: parseInt(isTestEnv ? process.env.TEST_DB_PORT ?? '3306' : process.env.DB_PORT ?? '3306', 10),
    username: isTestEnv ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME,
    password: isTestEnv ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME,
    charset: process.env.DB_CHARSET || 'utf8mb4_unicode_ci', // Corrigido o charset
    synchronize: true,  // Desativa a criação automática de tabelas
    logging: true,
    dropSchema: !!isTestEnv,

    entities: [Driver, Review, Riders, Customer],
  });




export const startServer = async () => {
  let queryRunner;
  try {
    console.log(process.env.DB_HOST); // Deve imprimir "db"
    console.log(process.env.DB_USERNAME); // Deve imprimir "admin"

    //await createDatabaseIfNotExists();
    await dataSource.initialize();

    console.log('Conectado ao banco de dados.');

    queryRunner = dataSource.createQueryRunner();

    // Inserir dados na tabela "drivers"
    await queryRunner.query(`
      INSERT INTO drivers (id, name, description, car, tax, km_lowest) VALUES
      (1, 'Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', 2.50, 1),
      (2, 'Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', 5.00, 5),
      (3, 'James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', 10.00, 10)
      ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), car = VALUES(car), tax = VALUES(tax), km_lowest = VALUES(km_lowest);
    `).then(() => console.log('Drivers query executed successfully.'))
      .catch(error => console.error('Error executing drivers query:', error));


    // Inserir dados na tabela "reviews"
    await queryRunner.query(`
      INSERT INTO reviews (id, rating, comment, driver_id) VALUES
      (1, 2, 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.', 1),
      (2, 4, 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!', 2),
      (3, 5, 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.', 3)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), driver_id = VALUES(driver_id);
    `);

    await queryRunner.query(`
      INSERT INTO Customer (customer_id) VALUES
      ('daniel'),
      ('João'),
      ('Patricia')
      ON DUPLICATE KEY UPDATE customer_id = VALUES(customer_id);
    `);
    console.log('Customers query executed successfully.');

    // Commit para garantir que as alterações sejam aplicadas
    await queryRunner.commitTransaction();

    console.log('Dados inseridos na tabela "reviews".');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    if (queryRunner) await queryRunner.release();
  }
};
