import { connection } from './services/db'
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    const dbConnection = connection();

    dbConnection.connect((err) => {
        if (err) {
            console.error('Erro de conexão: ', err.stack);
            return res.status(500).send('Erro de conexão com o banco de dados');
        }
        console.log('Conectado ao banco de dados');

        dbConnection.query('SELECT * FROM Driver', (err, results) => {
            if (err) {
                console.error('Erro na consulta: ', err);
                return res.status(500).send('Erro na consulta ao banco de dados');
            }
            res.json(results);
        });

        dbConnection.end();
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
