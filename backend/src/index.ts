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


const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
const port = 8080;
app.use(express.json())

app.use(cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
    id: number,
    name: string
}

interface CustomerRides {
    customer_id: string;
    rides: Ride[];
}

app.post('/ride/estimate', async (
    req: Request<{}, {}, { customerId: string, origin: string, destination: string }>,
    res: Response) => {
    try {
        const { customerId, origin, destination } = req.body;
        const returnedAllCoordenates = await RidersController.returnGetDirections(req.body.origin, req.body.destination);
        const customerRequest = await new Customer(customerId, [])
        const returnedRouteForCostumer = await RidersController.returnRouteRequest(returnedAllCoordenates, origin, destination);
        if (!returnedAllCoordenates || !returnedAllCoordenates) {
            return new ErrorInvalidRequest;
        }

        console.log(returnedRouteForCostumer);
        res.status(200).json(returnedRouteForCostumer)
    } catch (error) {
        console.log(error)
        res.status(500).json(new ErrorInter)
    }
});

app.patch('/ride/confirme', async (req: Request<{}, {}, { initRide: RequestRideForCustomer }>, res: Response) => {
    try {
        const { initRide } = req.body;
        initRide.destination.toLowerCase, initRide.origin.toLowerCase
        const driver = await DriverServices.findById(initRide.driver.id)
        if (initRide.origin && initRide.destination && initRide.customer_id === '' || null, initRide.origin === initRide.destination) {
            throw res.status(400).json(new ErrorInvalidRequest)
        }
        if (!driver) {
            throw res.status(404).json(new DriverNotFound(initRide.driver.name))
        }
        if (initRide.distance < driver.km_lowest) {
            throw res.status(406).json(new DistanceInvalid)
        }
        const rider = new Riders(initRide.origin, initRide.destination, initRide.distance, initRide.duration)
        const customerFinish = RidersService.initRideAccept(rider, driver, initRide.customer_id)
        console.log(customerFinish)
        throw res.status(200).json(new SuccessResponse)
    } catch {
        throw res.status(500).json(new ErrorInter)
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


app.get('/ride/:customer_id', async (req: Request, res: Response): Promise<CustomerRides | Customer | void> => {
    const customerId = req.params.customer_id;
    const driverId = req.query.driver_id ? parseInt(req.query.driver_id as string, 10) : undefined;

    try {
        const customer = await CustomerService.getRideForcustomer(customerId);

        if (driverId !== undefined) {
            const ride = await RidersService.returnRiderForDriver(driverId);
            const customerRides: CustomerRides = {
                customer_id: customerId,
                rides: [
                    {
                        id: ride.id,
                        date: ride.date,
                        origin: ride.origin,
                        destination: ride.destination,
                        distance: ride.distance,
                        duration: ride.duration,
                        driver: {
                            id: ride.driver?.id!,
                            name: ride.driver?.name!,
                        },
                        value: ride.value!,
                    },
                ],
            };
            res.status(200).json(customerRides);
            return customerRides; // Retorno explícito
        }

        if (!customer || (Array.isArray(customer) && customer.length === 0)) {
            const error = new InvalidDriver();
            res.status(400).json(error);
            return; // Não há valor para retornar
        }

        res.status(200).json(customer);
        return customer; // Retorno explícito
    } catch (error) {
        console.error(error);
        const internalError = new ErrorInter();
        res.status(500).json(internalError);
        return; // Não há valor para retornar em caso de erro
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
                const newReview = new Review(0, rating, comment, driverFind)
                const reviewsAdd = await ReviewService.createReview(newReview)
                throw res.status(200).json(new SuccessResponse);
            }
            throw res.status(400).json(new ErrorInvalidRequest)
        } catch (error) {
            console.log(error)
            new ErrorInter
        }
    });

startServer();
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
