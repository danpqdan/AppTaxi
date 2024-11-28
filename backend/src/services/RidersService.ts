import { Customer } from "../models/Customer";
import { Riders } from "../models/Riders";
import { dataSource } from "./DataSource";
import { DriverServices } from "./DriverService";
import { DistanceInvalid } from "./exceptionHandler/exceptionDriver";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";


export class RidersService {
    private static riderRepository = dataSource.getRepository(Riders);
    private static customerRiderRepository = dataSource.getRepository(Customer);


    static async patchRider(ride: Riders): Promise<SuccessResponse> {
        try {
            const updateRide = await this.riderRepository.update(
                { id: ride.id },
                { ...ride }
            );
            if (!updateRide) { throw new ErrorInvalidRequest }
            return new SuccessResponse;
        } catch {
            throw new ErrorInvalidRequest
        }
    }


    static async getRideForcustomer(customerId: string): Promise<Riders[]> {
        const customer = await this.customerRiderRepository.findOneBy({ customer_id: customerId })
        const customerData = await this.riderRepository.find({
            where: { costumerId: customer!.id },
            order: {
                date: 'DESC',
            }
        });

        if (!customerData) {
            throw new RiderNotFound
        }

        return customerData;
    }

    static async saveRider(rider: Riders) {
        try {
            if (rider.distance < 0) {
                throw new DistanceInvalid
            }

            await this.riderRepository.save(rider);
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