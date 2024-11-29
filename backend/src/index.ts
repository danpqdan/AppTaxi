import { Request, Response } from 'express';
import { isStringObject } from 'util/types';
import { RidersController } from './controllers/RiderController';
import { Driver } from './models/Driver';
import { Review } from './models/Review';
import { Riders } from './models/Riders';
import { CustomerService } from './services/CustomerService';
import { startServer } from './services/DataSource';
import { DriverServices } from './services/DriverService';
import { DistanceInvalid, DriverNotFound } from './services/exceptionHandler/exceptionDriver';
import { ErrorInter, ErrorInvalidRequest, SuccessResponse } from './services/exceptionHandler/exceptionRequest';
import { ReviewService } from './services/ReviewService';
import { RidersService } from './services/RidersService';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors(), express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

interface DriverRequest {
    name: string;
    description?: string;
    car: string;
    tax: number;
    km_lowest: number;
}

interface ReviewRequest {
    rating: number;
    comment: string;
    driverId: number;
}

interface RequestRideForCustomer {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: { id: number, name: string };
    value: number
}

interface Ride {
    id: number;
    date: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: CustomDriver;
    value: number;
}
interface CustomDriver {
    id: number
    name: string
}

app.post('/ride/estimate', async (
    req: Request<{}, {}, { customer_id: string, origin: string, destination: string }>,
    res: Response
) => {
    try {
        const { customer_id, origin, destination } = req.body;
        const customer = await CustomerService.getCustomerID(customer_id)
        const returnedAllCoordenates = await RidersController.returnGetDirections(origin, destination);

        // Verificando as coordenadas retornadas
        if (!returnedAllCoordenates) { throw new Error("Invalid coordinates returned"); }

        // Obtendo a rota para o cliente
        const returnedRouteForCostumer = await RidersController.returnRouteRequest(returnedAllCoordenates, origin, destination);
        const rider = new Riders(origin, destination, returnedRouteForCostumer.distanceInKm, returnedRouteForCostumer.durationInMin, customer.id, 0);
        await RidersService.saveRider(rider)
        // Enviando a resposta
        console.log(returnedRouteForCostumer);
        return res.status(200).json(returnedRouteForCostumer);
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorInter);
    }
});


app.patch('/ride/confirme', async (req: Request, res: Response) => {
    try {
        const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
        if (!origin || !destination || !customer_id || origin === destination) {
            return res.status(400).json(new ErrorInvalidRequest());
        }
        const rideFind = await RidersService.getRideForcustomer(customer_id)
        const driverServer: Driver = await DriverServices.findById(driver.id);
        if (!driver || driverServer.id != driver.id || driverServer.name != driver.name) {
            return res.status(404).json(new DriverNotFound(driver.name));
        }
        if (rideFind[0].distance < driverServer.km_lowest) {
            return res.status(406).json(new DistanceInvalid());
        }
        rideFind[0].origin, rideFind[0].destination, rideFind[0].distance, duration,
            rideFind[0].driver = driverServer.id, rideFind[0].value = value;
const updateRide = await RidersService.patchRider(rideFind[0])
if (updateRide.sucess_request != true) { new ErrorInter }
return res.status(200).json(new SuccessResponse());
    } catch (error) {
    console.error(error);
    return res.status(400).json(new SuccessResponse(false));
}
});

app.get('/ride/:customer_id', async (req: Request, res: Response) => {
    try {
        const { customer_id } = req.params;

        if (!customer_id) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }
        const rides = await RidersService.getRideForcustomer(customer_id);

        return res.status(200).json({ customer_id, rides });
    } catch (error) {
        console.error('Error fetching rides:', error);
        return res.status(500).json({ error: 'Internal server error' });
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
}),

    // Rota para listar todos os motoristas

    app.get('/drivers', async (req: Request, res: Response) => {
        try {
            const listDrive = await DriverServices.getAll()
            res.status(200).json(listDrive)
        } catch (error) {
            console.log(error)
            res.status(500).json(new ErrorInter)
        }
    }),

    // Endpoint para adicionar motoristas
    app.post('/review', async (req: Request<{}, {}, ReviewRequest>, res: Response) => {
        try {
            if (!req.body === null || undefined || []) {

                const { comment, rating, driverId } = req.body
                const driverFind = await DriverServices.findById(driverId)
                const newReview = new Review(0, rating, comment, driverFind.id)
                const reviewsAdd = await ReviewService.createReview(newReview)
                throw res.status(200).json(new SuccessResponse);
            }
            throw res.status(400).json(new ErrorInvalidRequest)
        } catch (error) {
            console.log(error)
            new ErrorInter
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
        const newDriver = new Driver(0, name, description!, car, parseFloat(tax.toFixed(2)), km_lowest);
        const driver = DriverServices.createDriver(newDriver)
        return res.status(200).json(new SuccessResponse)
    } catch (error) {
        console.log(error)
        res.status(400).json(new ErrorInvalidRequest)
    }
});

startServer();
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});