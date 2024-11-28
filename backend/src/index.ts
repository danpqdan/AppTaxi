import { Request, Response } from 'express';
import { isStringObject } from 'util/types';
import { RidersController } from './controllers/RiderController';
import { Customer } from './models/Customer';
import { Driver } from './models/Driver';
import { Review } from './models/Review';
import { Riders } from './models/Riders';
import { CustomerService } from './services/CustomerService';
import { startServer } from './services/DataSource';
import { DriverServices } from './services/DriverService';
import { DistanceInvalid, DriverNotFound, InvalidDriver } from './services/exceptionHandler/exceptionDriver';
import { ErrorInter, ErrorInvalidRequest, SuccessResponse } from './services/exceptionHandler/exceptionRequest';
import { ReviewService } from './services/ReviewService';
import { RidersService } from './services/RidersService';

const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors());
app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
    name: string
}

interface CustomerRides {
    customer_id: string;
    rides: Ride[];
}

app.post('/ride/estimate', async (
    req: Request<{}, {}, { customerId: string, origin: string, destination: string }>,
    res: Response
) => {
    try {
        const { customerId, origin, destination } = req.body;
        const returnedAllCoordenates = await RidersController.returnGetDirections(origin, destination);

        const rider = new Riders(origin, destination, 0, '');


        // Verificando as coordenadas retornadas
        if (!returnedAllCoordenates) {
            throw new Error("Invalid coordinates returned");
        }

        // Obtendo a rota para o cliente
        const returnedRouteForCostumer = await RidersController.returnRouteRequest(returnedAllCoordenates, origin, destination);

        // Enviando a resposta
        console.log(returnedRouteForCostumer);
        res.status(200).json(returnedRouteForCostumer);
    } catch (error) {
        console.log(error);
        res.status(500).json(new ErrorInter);
    }
});


app.patch('/ride/confirme', async (req: Request<{}, {}, { ride: RequestRideForCustomer }>, res: Response) => {
    try {
        const { ride } = req.body;

        if (!ride.origin || !ride.destination || !ride.customer_id || ride.origin === ride.destination) {
            res.status(400).json(new ErrorInvalidRequest());
        }

        const driver: Driver | null = await DriverServices.findById(ride.driver.id);
        if (!driver) {
            res.status(404).json(new DriverNotFound(ride.driver.name));
        }

        if (ride.distance < driver.km_lowest) {
            res.status(406).json(new DistanceInvalid());
        }

        const rider = new Riders(ride.origin, ride.destination, ride.distance, ride.duration);
        console.log(rider);

        res.status(200).json(new SuccessResponse());
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorInter());
    }
});

app.get('/ride/:customer_id', async (req: Request, res: Response) => {
    try {
        const { customer_id } = req.params;

        if (!customer_id) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const rides = await RidersService.getRideForcustomer(customer_id);

        if (rides.length === 0) {
            return res.status(404).json({ message: 'No rides found for this customer' });
        }
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
        const newDriver = new Driver(name, description!, car, parseFloat(tax.toFixed(2)), km_lowest);
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