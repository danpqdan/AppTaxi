import axios from 'axios';
import '../App.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RideForm = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (origin && destination && username) {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await axios.post('http://localhost:8080/ride/estimate', {
                    origin,
                    destination,
                    username,
                });

                // Verifique se a resposta contém a estimativa com a polyline
                if (response.data.routeResponse.polyline?.encodedPolyline) {
                    navigate('/ride/estimate', {
                        state: {
                            ...response.data,
                            origin,
                            destination,
                            username,
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
        <div className='background'>

            <form onSubmit={handleSubmit}>
                <div className='itensForm'>
                    <label>Origem:</label>
                    <input value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                </div>
                <div>
                    <label>Destino:</label>
                    <input value={destination} onChange={(e) => setDestination(e.target.value)} required />
                </div>
                <div>
                    <label>Usuário:</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Carregando...' : 'Estimar'}
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
};
