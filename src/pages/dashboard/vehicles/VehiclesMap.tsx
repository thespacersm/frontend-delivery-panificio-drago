import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {useServices} from '@/servicesContext';
import Vehicle from '@/types/Vehicle';
import VehicleHistoryMap from '@/components/dashboard/map/VehicleHistoryMap';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import Badge from '@/components/dashboard/ui/Badge';
// Importazione delle componenti FontAwesome
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowsAlt, faBolt, faClock, faFingerprint, faTachometerAlt} from '@fortawesome/free-solid-svg-icons';

// Assicurati di includere i CSS di Leaflet nel tuo HTML o importali qui
import 'leaflet/dist/leaflet.css';
import FlottaInCloudDevice from '@/types/flottaincloud/FlottaInCloudDevice';


const VehiclesMap: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {vehicleService, flottaInCloudService} = useServices();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [deviceData, setDeviceData] = useState<FlottaInCloudDevice | null>(null);
    const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

    // Caricamento dei dati del veicolo
    useEffect(() => {
        const loadVehicle = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const vehicleData = await vehicleService.getVehicle(Number(id));
                setVehicle(vehicleData);

                // Se il veicolo ha un IMEI, carica i dati del dispositivo
                if (vehicleData?.acf.imei) {
                    await fetchDeviceData(vehicleData.acf.imei);
                } else {
                    setError('Questo veicolo non ha un IMEI associato');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero dei dati del veicolo`);
            } finally {
                setIsLoading(false);
            }
        };

        loadVehicle();
    }, [id, vehicleService, flottaInCloudService]);

    // Funzione per recuperare i dati del dispositivo da FlottaInCloud
    const fetchDeviceData = async (imei: string) => {
        try {
            const data = await flottaInCloudService.getDevice(imei);
            setDeviceData(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero dei dati di localizzazione`);
            return null;
        }
    };

    // Impostazione dell'intervallo di aggiornamento dei dati
    useEffect(() => {
        if (vehicle?.acf.imei) {
            // Aggiorna i dati ogni 30 secondi
            const interval = window.setInterval(() => {
                fetchDeviceData(vehicle.acf.imei);
            }, 30000);

            setRefreshInterval(interval);

            return () => {
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                }
            };
        }
    }, [vehicle?.acf.imei]);

    // Cleanup dell'intervallo
    useEffect(() => {
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [refreshInterval]);

    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return <PageError message={error}/>;
    }

    if (!vehicle) {
        return <PageError message="Veicolo non trovato" type="warning"/>;
    }

    if (!deviceData) {
        return <PageError message="Dati di localizzazione non disponibili" type="warning"/>;
    }

    // Centro della mappa
    const position: [number, number] = [deviceData.lat, deviceData.lng];

    return (
        <>
            <PageHeader title={`Mappa del veicolo: ${vehicle.title.rendered}`}/>

            {/* Badge informativi del veicolo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Badge IMEI */}
                <Badge
                    title="IMEI"
                    value={vehicle.acf.imei || 'N/A'}
                    iconBgColor="bg-primary-100"
                    iconColor="text-primary-500"
                    icon={<FontAwesomeIcon icon={faFingerprint}/>}
                />

                {/* Badge Stato Connessione */}
                <Badge
                    title="Stato"
                    value={deviceData.is_connected ? 'Connesso' : 'Non connesso'}
                    iconBgColor={deviceData.is_connected ? 'bg-green-100' : 'bg-red-100'}
                    iconColor={deviceData.is_connected ? 'text-green-500' : 'text-red-500'}
                    valueColor={deviceData.is_connected ? 'text-green-500' : 'text-red-500'}
                    icon={<FontAwesomeIcon icon={faBolt}/>}
                />

                {/* Badge Velocità */}
                <Badge
                    title="Velocità"
                    value={<>{deviceData.speed} <span className="text-sm">km/h</span></>}
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-500"
                    icon={<FontAwesomeIcon icon={faTachometerAlt}/>}
                />

                {/* Badge Ultima posizione */}
                <Badge
                    title="Ultima posizione"
                    value={new Date(deviceData.timestamp_position).toLocaleTimeString()}
                    subValue={new Date(deviceData.timestamp_position).toLocaleDateString()}
                    iconBgColor="bg-amber-100"
                    iconColor="text-amber-500"
                    icon={<FontAwesomeIcon icon={faClock}/>}
                />

                {/* Badge In movimento */}
                <div className="md:col-span-2 lg:col-span-1">
                    <Badge
                        title="In movimento"
                        value={deviceData.moving ? 'Sì' : 'No'}
                        iconBgColor={deviceData.moving ? 'bg-indigo-100' : 'bg-gray-100'}
                        iconColor={deviceData.moving ? 'text-indigo-500' : 'text-gray-500'}
                        icon={<FontAwesomeIcon icon={faArrowsAlt}/>}
                    />
                </div>
            </div>

            <Card title="Posizione attuale">
                <div className="h-[500px] w-full">
                    <MapContainer center={position} zoom={13} style={{height: '100%', width: '100%'}}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                <div>
                                    <h3 className="font-bold">{vehicle.title.rendered}</h3>
                                    <p>Targa: {vehicle.acf.plate}</p>
                                    <p>IMEI: {vehicle.acf.imei}</p>
                                    <p>Velocità: {deviceData.speed} km/h</p>
                                    <p>Stato: {deviceData.is_connected ? 'Connesso' : 'Non connesso'}</p>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </Card>

            {vehicle.acf.imei && (
                <VehicleHistoryMap imei={vehicle.acf.imei}/>
            )}
        </>
    );
};

export default VehiclesMap;
