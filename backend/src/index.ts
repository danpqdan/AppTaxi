import { Request, Response } from 'express';


import { Driver } from './models/Driver';
import { RidersController } from './controllers/RiderController';
import { Client } from './models/Client';
import { startServer } from './services/DataSource';
import { DriverServices } from './services/DriverService';
import { ErrorInter, ErrorInvalidRequest, SuccessResponse } from './services/exceptionHandler/exceptionRequest';
import { isStringObject } from 'util/types';
const express = require('express')
const app = express()
const port = 8080;
app.use(express.json())



interface DriverRequest {
    name: string;
    description?: string;
    car: string;
    tax: number;
    km_lowest: number;
}

app.post('/ride/estimate', async (
    req: Request<{}, {}, { costumerId: number, origin: string, destination: string }>,
    res: Response) => {
    try {
        const { costumerId, origin, destination } = req.body;
        const returnedAllCoordenates = await RidersController.returnGetDirections(req.body.origin, req.body.destination);
        const clientRequest = await new Client(costumerId, [])
        const returnedRouteForCostumer = await RidersController.returnRouteRequest(returnedAllCoordenates, clientRequest, origin, destination);
        res.json(returnedRouteForCostumer)
        if (!returnedAllCoordenates || !returnedAllCoordenates) {
            return new ErrorInvalidRequest;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(ErrorInter)
    }
});

app.post('/driver', async (req: Request<{}, {}, DriverRequest>, res: Response) => {
    try {
        const { name, description, car, tax, km_lowest } = req.body;
        // Verificar se os dados necessários foram passados
        if (!name || !car || tax == null || isStringObject(tax) || km_lowest == null) {
            return res.status(400).json({ message: 'Name, car, tax(Should be number) e KM lowest its need' });
        }
        if (tax <= 0 || tax > 50) {
            return res.status(400).json({ message: 'Verify your tax! Max: 50 & min: 1' })
        }
        const newDriver = new Driver(name, description!, car, parseFloat(tax.toFixed(2)), km_lowest);
        const driver = DriverServices.createDriver(newDriver)
        return res.status(200).json(new SuccessResponse)
    } catch (error) {
        console.log(error)
        res.status(400).json(new ErrorInvalidRequest)
    }
});

app.get('./review', async (req: Request, res: Response) => {
    
}),


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
    }),

    // Rota para listar todos os motoristas
    app.get('/drivers', async (req: Request, res: Response): Promise<Response> => {
        const drivers = await DriverServices.getAll(); // Usando o método 'getAll'
        return res.json(drivers);
    }),

    // Inicializando o servidor
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    }),
    startServer()
