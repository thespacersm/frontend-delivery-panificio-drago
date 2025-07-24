import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import {useServices} from '@/servicesContext';
import {getPositionTypeDescription} from '@/enums/FlottaInCloudPositionTypeEnum';
import {splitPositionsIntoRouteSegments} from '@/utils/routeUtils';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FlottaInCloudPosition from '@/types/flottaincloud/FlottaInCloudPosition';
import MapNearGeoRequest from '@/types/nearmap/MapNearGeoRequest';
import MapNearGeoResponse from '@/types/nearmap/MapNearGeoResponse';

// Risolve il problema delle icone mancanti in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface VehicleHistoryMapProps {
    imei: string;
}



const VehicleHistoryMap: React.FC<VehicleHistoryMapProps> = ({imei}) => {
    const {flottaInCloudService, mapService} = useServices();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [positions, setPositions] = useState<FlottaInCloudPosition[]>([]);
    // Stato per memorizzare i segmenti di percorso separati
    const [routeSegments, setRouteSegments] = useState<Array<[number, number][]>>([]);
    // Stato per memorizzare l'indice dei clienti
    const [clientIndex, setClientIndex] = useState<Record<string, string>>({});

    // Stati per il form - unificati data e ora
    const [startDateTime, setStartDateTime] = useState<string>('');
    const [endDateTime, setEndDateTime] = useState<string>('');
    const [formError, setFormError] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);

    // Funzione per validare il form
    const validateForm = (): boolean => {
        setFormError(null);

        if (!startDateTime || !endDateTime) {
            setFormError('Tutti i campi sono obbligatori');
            return false;
        }

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        if (start < thirtyDaysAgo) {
            setFormError('La data di inizio non può essere anteriore a 30 giorni fa');
            return false;
        }

        if (end < start) {
            setFormError('La data di fine non può essere anteriore alla data di inizio');
            return false;
        }

        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (diffHours > 24) {
            setFormError('L\'intervallo tra inizio e fine non può superare 24 ore');
            return false;
        }

        return true;
    };

    // Funzione per creare la chiave dall'indice lat+lng
    const createLocationKey = (lat: number, lng: number): string => {
        return `${lat}_${lng}`;
    };

    // Funzione per recuperare le informazioni sui clienti
    const fetchClientInfo = async (positions: FlottaInCloudPosition[]) => {
        try {
            // Raccoglie tutte le coordinate
            const coordinates = positions.map(position => ({
                latitude: position.lat,
                longitude: position.lng
            }));

            // Crea la richiesta per il MapService
            const request: MapNearGeoRequest = {
                coordinates: coordinates
            };

            // Chiama il MapService
            const response: MapNearGeoResponse = await mapService.mapNearGeo(request);

            // Crea l'indice dei clienti
            const newClientIndex: Record<string, string> = {};
            
            if (response.points_with_customers && Array.isArray(response.points_with_customers)) {
                response.points_with_customers.forEach((result) => {
                    if (result.nearest_customer) {
                        const key = createLocationKey(
                            result.point.latitude,
                            result.point.longitude
                        );
                        newClientIndex[key] = result.nearest_customer.customer_name;
                    }
                });
            }

            setClientIndex(newClientIndex);
        } catch (err) {
            console.error('Errore durante il recupero delle informazioni sui clienti:', err);
            // Non impostiamo un errore generale per non bloccare la visualizzazione della mappa
        }
    };

    // Funzione per recuperare lo storico delle posizioni
    const fetchHistoryPositions = async () => {
        if (!validateForm() || !imei) return;

        try {
            setIsLoading(true);
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);

            const positionsData = await flottaInCloudService.getHistoryPositions(
                imei,
                start,
                end
            );

            // Verifica che positionsData sia un array
            if (!Array.isArray(positionsData)) {
                console.error('Le posizioni ricevute non sono un array:', positionsData);
                setError('Formato dei dati ricevuto non valido');
                setPositions([]);
                setRouteSegments([]);
                setShowMap(false);
                return;
            }

            const filteredPositions = positionsData;
            
            // Recupera le informazioni sui clienti per le posizioni filtrate
            await fetchClientInfo(filteredPositions);

            setPositions(filteredPositions);

            if (filteredPositions.length === 0) {
                setError('Nessuna posizione trovata nel periodo selezionato');
                setRouteSegments([]);
                setShowMap(false);
            } else {
                // Utilizza l'utility per dividere il percorso in segmenti
                const segments = splitPositionsIntoRouteSegments(filteredPositions);

                setRouteSegments(segments);
                setError(null);
                setShowMap(true);

            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il recupero dello storico delle posizioni');
            setPositions([]);
            setRouteSegments([]);
            setShowMap(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Colore blu stile Google Maps
    const googleMapsBlue = '#4285F4';

    // Imposta i valori predefiniti per il form con la data/ora corrente
    useEffect(() => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        // Formatta date e ore nel formato richiesto da datetime-local
        const formatDateTime = (date: Date) => {
            return date.toISOString().slice(0, 16);
        };

        setStartDateTime(formatDateTime(oneDayAgo));
        setEndDateTime(formatDateTime(now));
    }, []);

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Storico itinerario</h2>

                {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDateTime">
                            Data e ora inizio
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="startDateTime"
                            type="datetime-local"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDateTime">
                            Data e ora fine
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="endDateTime"
                            type="datetime-local"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <button
                        className="bg-primary hover:bg-primary cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={fetchHistoryPositions}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Caricamento...' : 'Visualizza itinerario'}
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <span className="sr-only">Caricamento...</span>
                </div>
            )}

            {error && !isLoading && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4"
                     role="alert">
                    {error}
                </div>
            )}

            {showMap && Array.isArray(positions) && positions.length > 0 && (
                <>
                    <div className="mb-4">
                        <p>Punti trovati: {positions.length}</p>
                        <p>Periodo:
                            dal {new Date(positions[0].timestamp).toLocaleString()} al {new Date(positions[positions.length - 1].timestamp).toLocaleString()}</p>
                        <p>Segmenti di percorso: {routeSegments.length}</p>
                    </div>

                    <div className="h-[500px] w-full">
                        <MapContainer
                            center={[positions[0].lat, positions[0].lng]}
                            zoom={13}
                            style={{height: '100%', width: '100%'}}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Visualizza ciascun segmento con lo stesso colore blu stile Google Maps */}
                            {routeSegments.map((segment, i) => (
                                <Polyline
                                    key={i}
                                    positions={segment}
                                    color={googleMapsBlue}
                                    weight={3}
                                >
                                    <Popup>Segmento {i + 1}</Popup>
                                </Polyline>
                            ))}

                            {/* Aggiungi marker solo per le posizioni con type diverso da 1 e con cliente */}
                            {positions
                                .filter(position => (position.type || 1) !== 1)
                                .map((position, index) => {
                                    const locationKey = createLocationKey(position.lat, position.lng);
                                    const clientName = clientIndex[locationKey];
                                    
                                    // Mostra il marker solo se c'è un cliente
                                    if (!clientName || clientName.trim() === '') {
                                        return null;
                                    }
                                     
                                     return (
                                         <Marker
                                             key={index}
                                             position={[position.lat, position.lng]}
                                         >
                                             <Popup>
                                                 <div>
                                                     <p>
                                                         <strong>Data:</strong> {new Date(position.timestamp).toLocaleString()}
                                                     </p>
                                                     <p>
                                                         <strong>Tipo:</strong> {getPositionTypeDescription(position.type || 1)}
                                                     </p>
                                                     <p><strong>Velocità:</strong> {position.speed || 0} km/h</p>
                                                     <p>
                                                         <strong>Coordinate:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                                                     </p>
                                                     <p><strong>Cliente:</strong> {clientName}</p>
                                                 </div>
                                             </Popup>
                                         </Marker>
                                     );
                                 })}
                        </MapContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default VehicleHistoryMap;
