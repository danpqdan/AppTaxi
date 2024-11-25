import { Driver } from "../models/Driver";
import { Riders } from "../models/Riders";
import { CustomerService } from "./CustomerService";
import { dataSource } from "./DataSource";
import { DriverServices } from "./DriverService";
import { DistanceInvalid, DriverNotFound } from "./exceptionHandler/exceptionDriver";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";


export class RidersService {
    private static riderRepository = dataSource.getRepository(Riders);

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

    static async initRideAccept(rider: Riders, driver: Driver, customerId: string): Promise<SuccessResponse> {
        try {
            if (rider.distance == 0) { throw new DistanceInvalid }
            if (driver.id == null) { throw new DriverNotFound("Invalid: ") }
            rider.value = rider.distance * driver.tax;
            const customerPatch = await CustomerService.patchRiderForCustomer(rider, customerId)
            rider.costumerId = customerPatch;
            const riderFinish = await this.riderRepository.save(rider);
            console.log(riderFinish, customerPatch)
            return new SuccessResponse
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest
        }
    };

    static async returnRiderForDriver(driverId: number): Promise<Riders> {
        try {
            const driver = await DriverServices.findById(driverId)
            const rider = await this.riderRepository.findOneBy({ driver: driver })
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