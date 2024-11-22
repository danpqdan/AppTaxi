async function getCoordinates(address: string, apiKey: string) {
    const encodedAddress = encodeURIComponent(address);  // Codifica o endereço para uso na URL
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            console.log('Latitude:', location.lat);
            console.log('Longitude:', location.lng);
            return location; 
        } else {
            throw new Error('Erro ao obter coordenadas');
        }
    } catch (error) {
        console.error('Erro ao chamar a API de Geocoding:', error);
    }
}



async function getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    apiKey: string
): Promise<any> {
    // Formata as coordenadas para passar na URL
    const originLatLng = `${origin.lat},${origin.lng}`;
    const destinationLatLng = `${destination.lat},${destination.lng}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLatLng}&destination=${destinationLatLng}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            console.log('Directions:', data.routes[0].legs[0]);
            const route = data.routes[0].legs[0];
            return route
        } else {
            throw new Error('Erro ao obter direções');
        }
    } catch (error) {
        console.error('Erro ao chamar API do Google Maps:', error);
    }
}


export async function returnClient(adress: [string, string]) {
    const apiKey = 'string'
    const coordinatesPromises = adress.map(address => getCoordinates(address, apiKey));
    const coordinates = await Promise.all(coordinatesPromises);
    const [originCoordinates, destinationCoordinates] = coordinates;

    console.log('Coordenadas de origem:', originCoordinates);
    console.log('Coordenadas de destino:', destinationCoordinates);

    getDirections(originCoordinates, destinationCoordinates, apiKey)
        .then((resultGoodSearch) => {
            if (resultGoodSearch) {
                console.log('Distância:', resultGoodSearch.distance.text);
                console.log('Duração:', resultGoodSearch.duration.text);

            }
        }).catch((err) => {
            console.log(err)
        });
}


