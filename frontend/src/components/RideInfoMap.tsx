import '../App.css';

import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
interface Driver {
    id: number;
    name: string;
    car: string;
    tax: number;
    km_lowest: number;
    value: number;
    reviews: { rating: number, comment: string }
}

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
        custumerId,
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
    }>();
    const [isVisibleDriver, setIsVisibleDriver] = useState(false);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];


    const toggleVisibilityRoute = () => {
        setIsVisibleRoutes((prev) => !prev);
    };

    const toogleVisibilityDriver = () => {
        setIsVisibleDriver((prev) => !prev)
    }

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



    const handleSubmit = async () => {
        const driverid = drivers?.id;
        const drivername = drivers?.name
        const value = ((leg.distance?.value ?? 0) / 1000).toFixed(2);
        const data = {
            customer_id: custumerId,
            origin: origin,
            destination: destination,
            distance: value,
            duration: response.duration,
            driver: { name: drivername, id: driverid },
            value: drivers?.value,
        };

        console.log('Dados a enviar:', data);  // Verifique no console os dados antes de enviar

        // Função para enviar os dados ao servidor
        try {
            const response = await axios.patch('http://localhost:8080/ride/confirme', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Motorista confirmado no servidor:', response.data);
        } catch {
            console.error('Erro ao confirmar motorista:');
        }
    };

    console.log(options)



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

            {isVisibleDriver && options.length > 0 ? (
                <ul>
                    {options.map((drivers: Driver) => (
                        <>
                            <li key={options!.id}> {/* Usando driver.id como chave única */}
                                <button onClick={() => setDrivers(drivers)}> {/* Passando o objeto completo para setDrivers */}
                                    <p>Selecionar Motorista</p>
                                </button>
                                <p>Name: {drivers.name}</p>
                                <p>Carro: {drivers.car}</p>
                                <p>Taxa: R${drivers.tax}</p>
                                <p>Preço Total: R${(drivers.value = (leg.distance!.value / 1000) * drivers.tax).toPrecision(2)}</p>
                            </li>
                        </>
                    ))}
                </ul>
            ) : isVisibleDriver && (
                <p>Nenhum motorista disponível no momento.</p>
            )}

            <button onClick={handleSubmit}>
                Confirmar Motorista
            </button>

        </div>


    )
}