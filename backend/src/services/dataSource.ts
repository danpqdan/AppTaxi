import { DataSource } from 'typeorm';
import { Driver } from '../models/Driver';
import { Review } from '../models/Review';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'app_taxi',
  charset: 'utf8mb4_unicode_ci',
  synchronize: true,
  logging: true,
  entities: [Driver, Review],
});

export const startServer = async () => {
  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');
  }
  catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

