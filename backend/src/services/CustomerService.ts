import { Customer } from "../models/Customer";
import { Riders } from "../models/Riders";
import { dataSource } from "./DataSource";
import { DistanceInvalid, DriverNotFound } from "./exceptionHandler/exceptionDriver";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { Driver } from "../models/Driver";
import { RidersService } from "./RidersService";

export class CustomerService {
    private static customerRiderRepository = dataSource.getRepository(Customer);
    private static riderRepository = dataSource.getRepository(Riders);

    static async save(costumer: Customer) {
        const customer = new Customer(costumer.customer_id);
        await this.customerRiderRepository.save(customer);

        if (!costumer) throw new ErrorInvalidRequest
    }

    static async findById(customerId: string): Promise<Customer | null> {
        const custumerData = await this.customerRiderRepository.findOneBy({ customer_id: customerId });
        if (!custumerData) {
            throw new RiderNotFound
        }
        return custumerData;
    }


    static async getCustomerID(customerId: string): Promise<Customer> {
        try {
            const findCustom = await this.customerRiderRepository.findOneBy({ customer_id: customerId })
            if (!findCustom || findCustom == null) {
                const newRider = new Customer(customerId)
                return await this.customerRiderRepository.save(newRider);
            }
            return findCustom!;
        } catch (error) {
            console.log(error);
            throw new ErrorInvalidRequest(); // Lançando o erro corretamente
        }
    }





}