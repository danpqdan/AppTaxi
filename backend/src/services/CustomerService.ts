import { Riders } from "../models/Riders";
import { dataSource } from "./DataSource";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { Customer } from "../models/Customer";
import { RiderNotFound } from "./exceptionHandler/exceptionRide";

export class CustomerService {
    private static customerRiderRepository = dataSource.getRepository(Customer);

    static async patchRiderForCustomer(rider: Riders, customerId: string): Promise<Customer> {
        try {
            const customer = await this.customerRiderRepository.findOneBy({ customer_id: customerId })
            if (!customer) {
                const newcustomer = new Customer(customerId, [rider]);
                return await this.customerRiderRepository.save(newcustomer);
            } else {
                if (!Array.isArray(customer.rides)) {
                    customer.rides = [];  // Se não for um array, inicializa como array vazio
                }
                customer.rides.push(rider);
                return await this.customerRiderRepository.save(customer);
            }
        } catch {
            throw new ErrorInvalidRequest
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