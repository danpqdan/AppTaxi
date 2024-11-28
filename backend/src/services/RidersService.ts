import { Customer } from "../models/Customer";
import { Riders } from "../models/Riders";
import { CustomerService } from "./CustomerService";
import { dataSource } from "./DataSource";
import { DriverServices } from "./DriverService";
import { DistanceInvalid, InvalidDriver } from "./exceptionHandler/exceptionDriver";
import { ErrorInvalidRequest } from "./exceptionHandler/exceptionRequest";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";


export class RidersService {
    private static riderRepository = dataSource.getRepository(Riders);
    private static customerRiderRepository = dataSource.getRepository(Customer);


    static async patchRider(ride: Riders) {

        await this.riderRepository.update(
            { id: ride.id },
            { ...ride }
        );
        // Fetch the updated rider record
        const updatedRide = await this.riderRepository.findOne({ where: { id: ride.id } });

        return updatedRide;
    }


    static async getRideForcustomer(customerId: string): Promise<Riders[]> {
        const customer = await this.customerRiderRepository.findOneBy({ customer_id: customerId })
        const custumerData = await this.riderRepository.findBy({ id: customer?.id });
        if (!custumerData) {
            throw new RiderNotFound
        }
        return custumerData;
    }

    static async createRider(rider: Riders): Promise<Riders> {
        try {
            if (rider.distance != 0) {
                throw new DistanceInvalid
            }
            return rider;
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest
        }
    };


    static async returnRiderForDriver(driverId: number): Promise<Riders> {
        try {
            const driver = await DriverServices.findById(driverId)
            const rider = await this.riderRepository.findOneBy({ driver: driverId })
            if (!rider) {
                throw new RiderNotFound();
            }
            return rider;
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest
        }
    }

}