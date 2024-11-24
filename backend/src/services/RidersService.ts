import { Riders } from "../models/Riders";
import { Driver } from "../models/Driver";
import { dataSource } from "./DataSource";
import { DistanceInvalid, DriverNotFound } from "./exceptionHandler/exceptionDriver";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";


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

    static async initRideAccept(rider: Riders, driver: Driver): Promise<SuccessResponse> {
        try {

            if (rider.distance == 0) { throw new DistanceInvalid }
            if (driver.id == null) { throw new DriverNotFound("Invalid: ") }
            rider.value = rider.distance * driver.tax;
            const riderInit = await this.riderRepository.save(rider);
            console.log(riderInit)
            return new SuccessResponse
        } catch (error) {
            console.log(error)
            throw new ErrorInvalidRequest
        }
    };

}