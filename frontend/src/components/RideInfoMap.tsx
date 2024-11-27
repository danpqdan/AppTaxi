import '../App.css';

import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export default function RideInfoMap() {

    const position = { lat: 34.0522, lng: -118.2437 }; // Coordenadas de Los Angeles
    const api = import.meta.env.VITE_GOOGLE_API_KEY

    return (
        <div style={{ height: "100vh", width: "100vw" }}>

            <APIProvider apiKey={api} >
                <Map
                    defaultZoom={12}
                    colorScheme={'DARK'}
                    zoomControl={true}
                    mapId={api}
                    clickableIcons={false}
                    scrollwheel={true} // Ativa o zoom com o scroll do mouse
                    fullscreenControl={true} // Esconde o botão de tela cheia

                >
                    <Diretions />
                </Map>
            </APIProvider>
        </div >
    )
};

function Diretions() {
    const map = useMap()
    const routeLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routeLibrary || !map) return;
        setDirectionsService(new routeLibrary.DirectionsService())
        setDirectionsRenderer(new routeLibrary.DirectionsRenderer(({ map })))
    }, [routeLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;
        directionsService.route({
            origin: "rua fontoura xavier 55 itaquera",
            destination: "rua dante pazzanese 500 moema",
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }).then(response => {
            directionsRenderer.setDirections(response)
            setRoutes(response.routes)
        })

    }, [directionsService, directionsRenderer]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    console.log(routes)

    if (!leg) return null;

    return <div className='directions'>
        <h2>{selected.summary}</h2>
        <p>De: {leg.start_address.split(",")[0]} <br />Para: {leg.end_address.split(",")[0]}</p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duração: {leg.duration?.text}</p>

        <h2>
            <ul>
                {routes.map((route, index) => <li key={route.summary}><button onClick={() => setRouteIndex(index)}>{route.summary}</button></li>)}
            </ul>
        </h2>
    </div>
}