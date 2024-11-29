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

    static async returnRouteRequest(coordinates: Coordinates, origin: string, destination: string) {
        const dataReturnGoogle = await setParametersForSearch(coordinates);
        const route = dataReturnGoogle.routes[0];
        const distance = route.distanceMeters;
        const durationInMin = convertDuration(route.duration);
        const distanceInKm = distance / 1000;

        const newTrip = new Riders(
            origin,
            destination,
            distanceInKm,
            durationInMin,
            0,
            0
        )
        const driversFind = await DriverServices.findForKmLowest(distanceInKm);
        


        return {
            coordinates,
            distanceInKm,
            durationInMin,
            options: driversFind,
            routeResponse: route
        }
    };
}
function convertDuration(duration: string): string {
    // Extrai os segundos da string (removendo a palavra "segundos")
    const seconds = parseInt(duration.replace('s', '').trim(), 10);

    // Converte os segundos para minutos e o restante em segundos
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Formata o resultado
    if (minutes > 0 && remainingSeconds > 0) {
        return `${minutes} m e ${remainingSeconds} s`;
    } else if (minutes > 0) {
        return `${minutes} m`;
    } else {
        return `${remainingSeconds} s`;
    }
}

