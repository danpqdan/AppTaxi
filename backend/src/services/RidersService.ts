import { Riders } from "../models/Riders";
import { CustomerService } from "./CustomerService";
import { dataSource } from "./DataSource";
import { DriverServices } from "./DriverService";
import { DistanceInvalid, InvalidDriver } from "./exceptionHandler/exceptionDriver";
import { ErrorInvalidRequest } from "./exceptionHandler/exceptionRequest";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";


export class RidersService {
    private static riderRepository = dataSource.getRepository(Riders);

    static async patchRider(ride: Riders) {
        // Perform the update
        await this.riderRepository.update(
            { id: ride.id }, // Filter by ID
            { ...ride }       // Spread the rider data to update
        );

        // Fetch the updated rider record
        const updatedRide = await this.riderRepository.findOne({ where: { id: ride.id } });

        return updatedRide;
    }



    static async returnRiderForCustomer(customerId: string): Promise<Riders | any> {
        try {
            const customer = await CustomerService.findById(customerId);
            if (!customer) {
                throw new Error("Customer not found");
            }
            const rider = await this.riderRepository.findOneBy({ costumerId: customer.id });

            if (!rider) {
                throw new RiderNotFound();
            }

            return rider;
        } catch (error) {
            console.log(error);
            throw new InvalidDriver
        }
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