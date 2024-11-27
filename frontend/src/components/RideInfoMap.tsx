import '../App.css';

import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RideInfoMap() {
    const api = import.meta.env.VITE_GOOGLE_API_KEY


    return (
        <div style={{ height: "100vh", width: "100vw" }}>

            <APIProvider apiKey={api} >
                <Map
                    defaultZoom={12}
                    // colorScheme={'DARK'}
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
    const location = useLocation();
    const { origin,
        destination,
        customerId,
        response,
        options } = location.state || {};
    const routeLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
    const [routeIndex, setRouteIndex] = useState(0);
    const [isVisibleRoutes, setIsVisibleRoutes] = useState(false);
    const [drivers, setDrivers] = useState<{
        id: number;
        name: string;
        car: string;
        tax: number;
        value: number;
    }[]>([]);
    const [isVisibleDriver, setIsVisibleDriver] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<{ id: number; name: string } | null>(null);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];


    const toggleVisibilityRoute = () => {
        setIsVisibleRoutes((prev) => !prev);
    };

    const toogleVisibilityDriver = () => {
        setIsVisibleDriver((prev) => !prev)
    }

    const handdleSetDriver = (driver: { id: number; name: string }) => {
        setSelectedDriver(driver);
    };


    // console.log(destination)
    // console.log(customerId)
    // console.log(origin)
    // console.log(response)
    console.log(options)

    useEffect(() => {
        if (options && options.length > 0) {
            setDrivers(options);

        }
    }, [options]);

    useEffect(() => {
        if (!routeLibrary || !map) return;
        setDirectionsService(new routeLibrary.DirectionsService())
        setDirectionsRenderer(new routeLibrary.DirectionsRenderer(({ map })))
    }, [routeLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;
        directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }).then(response => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        }).catch(error => {
            console.error("Error fetching route: ", error);
        });
    }, [directionsService, directionsRenderer, origin, destination]);

    useEffect(() => {
        if (!directionsRenderer || routes.length === 0) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer, routes]);

    const confirmRide = async () => {
        if (!selectedDriver) {
            alert("Por favor, selecione um motorista.");
            return;
        }

        const data = {
            customer_id: customerId,
            origin: leg.start_address,
            destination: leg.end_address,
            distance: response.distance,
            duration: response.duration,
            driver: selectedDriver,
            value: response.value,
        };

        try {
            const response = await fetch('', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erro ao confirmar a corrida: ${response.statusText}`);
            }
            console.log(response)

            const result = await response.json();
            console.log('Confirmação bem-sucedida:', result);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    console.log(routes)

    if (!leg) return null;

    return (
        <div className='directions'>
            <h2>{selected.summary}</h2>
            <p>
                De: {leg.start_address.split(",")[0]} <br />
                Para: {leg.end_address.split(",")[0]}
            </p>
            <p>Distância: {leg.distance?.text}</p>
            <p>Duração: {leg.duration?.text}</p>

            <button className="close-summary" onClick={toggleVisibilityRoute}>
                {isVisibleRoutes ? 'Fechar' : 'Abrir rotas Alternativas'} Resumo
            </button>
            {isVisibleRoutes && (
                <>
                    <ul>
                        <h3>Rotas Alternativas:</h3>
                        {routes.map((route, index) => (
                            <li key={route.summary}>
                                <button onClick={() => setRouteIndex(index)}>{route.summary}</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <button onClick={toogleVisibilityDriver}>
                {isVisibleDriver ? 'Alterar Rota' : 'Motoristas Disponíveis'}
            </button>

            {isVisibleDriver && drivers.length > 0 ? (
                <ul>
                    {drivers.map((driver) => (
                        <li key={driver.id}> {/* Use driver.id como a chave única */}
                            <button onClick={() => handdleSetDriver({ id: driver.id, name: driver.name })}>
                                <p>Selecionar Motorista</p>
                            </button>
                            <p>Name: {driver.name}</p>
                            <p>Carro: {driver.car}</p>
                            <p>Taxa: R${driver.tax}</p>
                            <p>Preço Total: R${driver.value}</p>
                        </li>
                    ))}
                </ul>
            ) : isVisibleDriver && (
                <p>Nenhum motorista disponível no momento.</p>
            )}

            <button onClick={confirmRide}>Confirmar Corrida</button>

        </div>


    )
}