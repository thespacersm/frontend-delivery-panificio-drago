interface FlottaInCloudPosition {
    lng: number;           // Longitudine della posizione
    lat: number;           // Latitudine della posizione
    heading: number;       // Direzione del dispositivo in questa posizione (0 - 359)
    altitude: number;      // Altitudine della posizione in metri
    speed: number;         // Velocità del veicolo in questa posizione in Km/h
    timestamp: number; // Quando è stata registrata questa posizione (timestamp in ms)
    type: number;          // Tipologia della posizione (1-11)
    odometer?: number;     // Metri percorsi durante l'ultimo trip (solo se type == 5)
}

export default FlottaInCloudPosition;
