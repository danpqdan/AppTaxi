import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/form.css';

export const RideForm = () => {
    const api = import.meta.env.VITE_GOOGLE_API_KEY

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [originBox, setOriginBox] = useState<google.maps.places.SearchBox>();
    const [destinationBox, setDestinationBox] = useState<google.maps.places.SearchBox>();

    const onLoadOrigin = (ref: google.maps.places.SearchBox) => {
        setOriginBox(ref);
    };

    const onLoadDestination = (ref: google.maps.places.SearchBox) => {
        setDestinationBox(ref);
    };

    const onOriginChanged = () => {
        const places = originBox?.getPlaces();
        if (places && places[0]) {
            setOrigin(places[0].formatted_address || '');
        }
    };

    const onDestinationChanged = () => {
        const places = destinationBox?.getPlaces();
        if (places && places[0]) {
            setDestination(places[0].formatted_address || '');
            console.log(origin, destination)

        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (origin && destination && customerId) {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await axios.post('http://localhost:8080/ride/estimate', {
                    origin,
                    destination,
                    customerId,
                });

                // Verifique se a resposta contém a estimativa com a polyline
                if (response.data.routeResponse.polyline?.encodedPolyline) {
                    navigate('/ride/estimate', {
                        state: {
                            origin,
                            destination,
                            customerId,
                            polyline: response.data.routeResponse.polyline?.encodedPolyline,
                        },
                    });
                } else {
                    setErrorMessage('Polyline não encontrada na resposta da API.');
                }
            } catch (error) {
                console.error('Erro ao estimar a corrida:', error);
                setErrorMessage('Erro ao enviar os dados. Tente novamente.');
            } finally {
                setLoading(false);
            }
        } else {
            setErrorMessage('Por favor, preencha todos os campos.');
        }
    };

    return (

        <LoadScript googleMapsApiKey={api} libraries={['places']}>
            <div className='background'>

                <form onSubmit={handleSubmit}>
                    <div className='containerForm'>
                        <h1 style={{ textAlign: "center", fontSize: "22px", color: ' rgb(224, 216, 216)' }}>Selecione seu trajeto</h1>
                        <StandaloneSearchBox onLoad={onLoadOrigin} onPlacesChanged={onOriginChanged}>
                            <div className='itensForm'>
                                <label>Origem:</label>
                                <input value={origin} onChange={(ref) => setOrigin(ref.target.value)} required />
                            </div>

                        </StandaloneSearchBox>
                        <StandaloneSearchBox onLoad={onLoadDestination} onPlacesChanged={onDestinationChanged} >

                            <div className='itensForm'>
                                <label>Destino:</label>
                                <input value={destination} onChange={(e) => setDestination(e.target.value)} required />
                            </div>
                        </StandaloneSearchBox>
                        <div className='itensForm'>
                            <label>Usuário:</label>
                            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading}>
                            <p>
                                {loading ? 'Carregando...' : 'Estimar'}
                            </p>
                        </button>
                    </div>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </form>
            </div >
        </LoadScript>
    );
};
