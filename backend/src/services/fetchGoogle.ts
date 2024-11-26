import { Coordinates } from '../controllers/RiderController'
import { ErrorInvalidRequest } from './exceptionHandler/exceptionRequest';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const keyApi = process.env.GOOGLE_API_KEY;



export async function getCoordinates(address: string) {
    if (!keyApi) {
        throw new Error('Chave da API do Google não encontrada. Verifique o arquivo .env');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keyApi}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            console.log('Latitude:', location.lat);
            console.log('Longitude:', location.lng);
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error(`Erro na API de Geocodificação: ${data.status}`);
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API de Geocoding:', error);
    }
}



export async function getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
): Promise<any> {
    // Formata as coordenadas para passar na URL
    const originLatLng = `${origin.lat},${origin.lng}`;
    const destinationLatLng = `${destination.lat},${destination.lng}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLatLng}&destination=${destinationLatLng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            console.log('Directions:', data.routes[0].legs[0]);
            return data.routes[0].legs[0];
        } else {
            throw new Error('Erro ao obter direções');
        }
    } catch (error) {
        console.error('Erro ao chamar API do Google Maps:', error);
    }
}

export async function setParametersForSearch(coordinates: Coordinates): Promise<any> {
    const apiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const body = {
        origin: {
            location: {
                latLng: {
                    latitude: coordinates.origin.lat,
                    longitude: coordinates.origin.lng,
                },
            },
        },
        destination: {
            location: {
                latLng: {
                    latitude: coordinates.destination.lat,
                    longitude: coordinates.destination.lng,
                },
            },
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
        },
        languageCode: 'en-US',
        units: 'IMPERIAL',
    };

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': keyApi!,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText} (status: ${response.status})`);
        }

        const data = await response.json();
        console.log(data)
        return data;


    } catch (error) {
        console.error(`Erro ao processar a requisição: ${(error as Error).message}`);
        throw error; // Relança o erro para ser tratado pelo chamador
    }
}




