import { Request, Response } from 'express';
import { startServer } from "./services/dataSource";

import { Driver } from './models/Driver';
import { testeDriver } from "./testes/testeDriverModels";
import { DriverServices } from './services/DriverServices';
const express = require('express')
const app = express()
const port = 8080;
app.use(express.json())

const driverTest = testeDriver

interface DriverRequest {
    name: string;
    description?: string;
    car: string;
    tax: number;
    km_lowest: number;
}

app.post('/drivers', async (req: Request<{}, {}, DriverRequest>, res: Response) => {
    const { name, description, car, tax, km_lowest } = req.body;
    // Verificar se os dados necessários foram passados
    if (!name || !car || tax == null || km_lowest == null) {
        return res.status(400).json({ message: 'Nome, carro, taxa e KM mínimo são obrigatórios' });
    }
});


// Rota para buscar um motorista pelo ID
app.get('/drivers/:id', async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const driver = await DriverServices.findById(id); // Usando o método 'findById'
    if (driver) {
        return res.json(driver);
    } else {
        return res.status(404).json({ message: 'Motorista não encontrado' });
    }
});

// Rota para listar todos os motoristas
app.get('/drivers', async (req: Request, res: Response): Promise<Response> => {
    const drivers = await DriverServices.getAll(); // Usando o método 'getAll'
    return res.json(drivers);
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

startServer();