import { Costumer } from "../models/Costumer";
import { Riders } from "../models/Riders";
import { RidersService } from "../services/RidersService";
import { getCoordinates, setParametersForSearch } from "../services/FetchGoogle";
import { DriverServices } from "../services/DriverService";

export interface Coordinates {
    origin: { lat: number, lng: number };
    destination: { lat: number, lng: number };
}


export class RidersController {
    static async returnGetDirections(addressOrigin: string, addressDestination: string): Promise<Coordinates> {
        try {
            const originCoords = await getCoordinates(addressOrigin);
            const destinationCoords = await getCoordinates(addressDestination);

            if (originCoords && destinationCoords) {
                console.log(`Origem: Lat ${originCoords.lat}, Lng ${originCoords.lng}`);
                console.log(`Destino: Lat ${destinationCoords.lat}, Lng ${destinationCoords.lng}`);

                // Retorna o objeto com as coordenadas no formato esperado
                return {
                    origin: { lat: originCoords.lat, lng: originCoords.lng },
                    destination: { lat: destinationCoords.lat, lng: destinationCoords.lng },
                };
            } else {
                throw new Error('Coordenadas de origem ou destino não foram encontradas.');
            }

        } catch (error) {
            console.error('Erro ao obter direções:', error);
            throw new Error('Não foi possível obter as direções.');
        }


    }



    static async returnRouteRequest(coordinates: Coordinates, CostumerRequest: Costumer, origin: string, destination: string): Promise<any> {
        const dataReturnGoogle = await setParametersForSearch(coordinates);
        const route = dataReturnGoogle.routes[0];
        const distance = route.legs[0].distanceMeters;
        const duration = route.legs[0].duration;

        const newTrip = new Riders(
            origin,
            destination,
            distance,
            duration,
            CostumerRequest,
        )
        const rider = await RidersService.createRider(newTrip);
        const driversFind = await DriverServices.findForKmLowest(rider);
        driversFind.forEach(driver => { driver.tax *= newTrip.distance });

        return {
            coordinates,
            distance,
            duration,
            options: [driversFind],
            routeResponse: route
        }
    };

}
