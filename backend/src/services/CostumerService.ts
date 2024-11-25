import { Riders } from "models/Riders";
import { dataSource } from "./DataSource";
import { ErrorInvalidRequest, SuccessResponse } from "./exceptionHandler/exceptionRequest";
import { Costumer } from "models/Costumer";

export class CostumerService {
    private static costumerRiderRepository = dataSource.getRepository(Costumer);

    static async patchRiderForCostumer(rider: Riders, costumerId: string): Promise<Costumer> {
        try {
            const costumer = await this.costumerRiderRepository.findOneBy({ customer_id: costumerId })
            if (!costumer) {
                const newCostumer = new Costumer(costumerId, [rider]);
                return await this.costumerRiderRepository.save(newCostumer);
            } else {
                costumer.rides.push(rider)
                return await this.costumerRiderRepository.save(costumer);
            }
        } catch {
            throw new ErrorInvalidRequest
        }
    }

}