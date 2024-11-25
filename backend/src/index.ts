import { Request, Response } from 'express';


import { CustomerService } from './services/CustomerService';
import { RidersController } from './controllers/RiderController';
import { Customer } from './models/Customer';
import { Driver } from './models/Driver';
import { Riders } from './models/Riders';
import { startServer } from './services/DataSource';
import { DriverServices } from './services/DriverService';
import { DistanceInvalid, DriverNotFound, InvalidDriver } from './services/exceptionHandler/exceptionDriver';
import { ErrorInter, ErrorInvalidRequest, SuccessResponse } from './services/exceptionHandler/exceptionRequest';
import { RidersService } from './services/RidersService';
import { isStringObject } from 'util/types';
const express = require('express')
const app = express()// Multiplica a taxa pelo km e armazena em uma nova propriedade
const port = 8080;
app.use(express.json())

interface DriverRequest {
    name: string;
    description?: string;
    car: string;
    tax: number;
    km_lowest: number;
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
        res.json(returnedRouteForCostumer)
    } catch (error) {
        console.log(error)
        res.status(500).json(ErrorInter)
    }
});

app.patch('/ride/confirme', async (req: Request<{}, {}, { initRide: RequestRideForCustomer }>, res: Response) => {
    try {
        const { initRide } = req.body;
        initRide.destination.toLowerCase, initRide.origin.toLowerCase
        const driver = await DriverServices.findById(initRide.driver.id)
        if (initRide.origin && initRide.destination && initRide.customer_id === '' || null, initRide.origin === initRide.destination) {
            throw res.status(400).json(ErrorInvalidRequest)
        }
        if (!driver) {
            throw res.status(404).json(DriverNotFound)
        }
        if (initRide.distance < driver.km_lowest) {
            throw res.status(406).json(DistanceInvalid)
        }
        const rider = new Riders(initRide.origin, initRide.destination, initRide.distance, initRide.duration)
        const customerFinish = RidersService.initRideAccept(rider, driver, initRide.customer_id)
        console.log(customerFinish)
        throw res.status(200).json(SuccessResponse)
    } catch {
        throw res.status(500).json(ErrorInter)
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


app.get('/ride/:customer_id', async (req: Request, res: Response): Promise<CustomerRides | Customer> => {
    const customerId = req.params.customer_id;
    const driverId = req.query.driver_id ? parseInt(req.query.driver_id as string, 10) : undefined; // Extrai driver_id da query string
    try {
        const customer = await CustomerService.getRideForcustomer(customerId);
        if (driverId != undefined) {
            const ride = await RidersService.returnRiderForDriver(driverId)
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
                            name: ride.driver?.name!
                        },
                        value: ride.value!
                    }
                ]
            };
            throw res.status(200).json(customerRides)
        }
        if (!customer || (Array.isArray(customer) && customer.length === 0)) {
            throw res.status(400).json(InvalidDriver);
        }
        throw res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        throw new ErrorInter
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
    app.get('/drivers', async (req: Request, res: Response): Promise<Response> => {
        const drivers = await DriverServices.getAll(); // Usando o método 'getAll'
        return res.json(drivers);
    }),

    // Inicializando o servidor
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    }),
    startServer()
