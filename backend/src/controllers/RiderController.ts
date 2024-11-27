import { Riders } from "../models/Riders";
import { DriverServices } from "../services/DriverService";
import { getCoordinates, setParametersForSearch } from "../services/FetchGoogle";
import { RidersService } from "../services/RidersService";

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



    static async returnRouteRequest(coordinates: Coordinates, origin: string, destination: string): Promise<any> {
        const dataReturnGoogle = await setParametersForSearch(coordinates);
        const route = dataReturnGoogle.routes[0];
        const distance = route.distanceMeters;
        const duration = route.duration;

        const newTrip = new Riders(
            origin,
            destination,
            distance,
            duration
        )

        console.log(newTrip)
        //const rider = await RidersService.createRider(newTrip);
        const driversFind = await DriverServices.findForKmLowest(newTrip);
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
