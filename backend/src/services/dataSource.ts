import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm'; // Certifique-se de importar DataSource corretamente
import { Driver } from '../models/Driver';
import { Review } from '../models/Review';
import { Riders } from '../models/Riders';
import { Client } from '../models/Client';

dotenv.config();
const isTestEnv = process.env.NODE_ENV === 'test';

export const dataSource = new DataSource({
  type: 'mysql',
  host: isTestEnv ? process.env.TEST_DB_HOST : process.env.DB_HOST,
  port: parseInt(isTestEnv ? process.env.TEST_DB_PORT ?? '3306' : process.env.DB_PORT ?? '3306', 10),
  username: isTestEnv ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME,
  password: isTestEnv ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  database: isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  charset: process.env.DB_CHARSET || 'utf8mb4_unicode_ci',
  synchronize: true,
  logging: !!isTestEnv,
  entities: [Driver, Review, Riders, Client],
  // Usar dropSchema apenas para o ambiente de testes
  dropSchema: !!isTestEnv,
});

export const startServer = async () => {
  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');
    console.log('Entidades carregadas:', dataSource.options.entities);
  }
  catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};