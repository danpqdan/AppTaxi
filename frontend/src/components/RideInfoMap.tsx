import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { useState } from 'react';

const mapContainerStyle = { width: '100%', height: '500px' };
const defaultCenter = { lat: -23.5349029, lng: -46.4381596 }; // Ajuste conforme necessário


export const RideInfoMap = ({ polyline, estimatedTime, apiKey }: { polyline: string, origin: string, destination: string, estimatedTime: string, apiKey: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Função para decodificar a polyline
    const decodePolyline = (encoded: string): { lat: number, lng: number }[] => {
        if (window.google && google.maps.geometry) {
            return google.maps.geometry.encoding.decodePath(encoded).map((coord: google.maps.LatLng) => ({
                lat: coord.lat(),
                lng: coord.lng(),
            }));
        }
        return [];
    };

    const decodedPath = decodePolyline(polyline);

    // Usando o estado para controlar quando a API for carregada
    const handleApiLoad = () => {
        setIsLoaded(true);
    };

    return (
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={['geometry']}
            onLoad={handleApiLoad}  // Definindo a função de carregamento
        >
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={12}
                >
                    <Polyline
                        path={decodedPath}
                        options={{
                            visible: true,
                            strokeColor: '#00ffc8',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                </GoogleMap>
            ) : (
                <p>Carregando mapa...</p> // Mensagem enquanto o mapa não carrega
            )}
            <div>
                <p><strong>Tempo Estimado:</strong> {estimatedTime}</p>
            </div>
        </LoadScript>
    );
};
