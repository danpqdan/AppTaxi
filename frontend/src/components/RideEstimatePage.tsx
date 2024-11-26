import { useLocation } from 'react-router-dom';
import { RideInfoMap } from './RideInfoMap';

export const RideEstimatePage = () => {
  const location = useLocation();
  const { origin, destination, username, routeResponse } = location.state;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Acessando a chave da API


  const polyline = routeResponse.polyline?.encodedPolyline;

  // Estimativa de tempo (duração) extraída da resposta
  const estimatedTime = routeResponse.duration;  // Exemplo: "751s"

  return (
    <div>
      <h1>Estimações de Corrida</h1>
      <p><strong>Origem:</strong> {origin}</p>
      <p><strong>Destino:</strong> {destination}</p>
      <p><strong>Usuário:</strong> {username}</p>

      {/* Exibe o mapa se a polyline estiver presente */}
      {polyline ? (
        <RideInfoMap
          apiKey={apiKey}
          origin={origin}
          destination={destination}
          estimatedTime={estimatedTime}
          polyline={polyline}
        />
      ) : (
        <p>Não foi possível gerar a polyline para este trajeto.</p>
      )}
    </div>
  );
};
