import { Customer } from "../models/Customer";
import { Riders } from "../models/Riders";
import { dataSource } from "./DataSource";
import { DistanceInvalid, DriverNotFound } from "./exceptionHandler/exceptionDriver";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { Driver } from "models/Driver";

export class CustomerService {
    private static customerRiderRepository = dataSource.getRepository(Customer);
    private static riderRepository = dataSource.getRepository(Riders);

    static async findById(customerId: string): Promise<Customer | null> {
        const custumerData = await this.customerRiderRepository.findOneBy({ customer_id: customerId });
        if (!custumerData) {
            throw new RiderNotFound
        }
        return custumerData;
    }


    static async patchRiderForCustomer(rider: Riders, driver: Driver, customerId: string): Promise<SuccessResponse> {
        try {
            if (rider.distance == 0) {
                throw new DistanceInvalid();
            }
            if (driver.id == null) {
                throw new DriverNotFound("Invalid: ");
            }

            // Calcular o valor do rider com base na distância e taxa do driver
            rider.value = rider.distance * driver.tax;

            // Atualizar o cliente com o rider
            const customerPatch = await CustomerService.getRideForcustomer(customerId);
            rider.costumerId?.includes(customerPatch.customer_id);

            const riderFinish = await this.riderRepository.save(rider);

            console.log(riderFinish, customerPatch);
            return new SuccessResponse();
        } catch (error) {
            console.log(error);
            throw new ErrorInvalidRequest(); // Lançando o erro corretamente
        }
    }




    static async getRideForcustomer(customerId: string): Promise<Customer> {
        const custumerData = await this.customerRiderRepository.findOneBy({ customer_id: customerId });
        if (!custumerData) {
            throw new RiderNotFound
        }
        return custumerData;
    }
}