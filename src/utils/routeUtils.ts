import FlottaInCloudPosition from "@/types/flottaincloud/FlottaInCloudPosition";


/**
 * Calcola la distanza tra due coordinate geografiche
 * @param lat1 Latitudine del primo punto
 * @param lng1 Longitudine del primo punto
 * @param lat2 Latitudine del secondo punto
 * @param lng2 Longitudine del secondo punto
 * @returns Distanza in km
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Raggio terrestre in km
    const toRad = (value: number) => value * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distanza in km
};

/**
 * Divide le posizioni in segmenti di percorso
 * @param positions Lista delle posizioni
 * @param distanceThreshold Soglia di distanza in km per dividere i segmenti
 * @returns Array di segmenti di percorso
 */
export const splitPositionsIntoRouteSegments = (
    positions: FlottaInCloudPosition[],
    distanceThreshold: number = 2
): Array<[number, number][]> => {
    const segments: Array<[number, number][]> = [];
    let currentSegment: [number, number][] = [];

    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const point: [number, number] = [pos.lat, pos.lng];

        if (i === 0) {
            // Primo punto, inizia un nuovo segmento
            currentSegment.push(point);
        } else {
            const prevPos = positions[i - 1];
            const distance = calculateDistance(prevPos.lat, prevPos.lng, pos.lat, pos.lng);

            if (distance > distanceThreshold) {
                // Distanza > soglia, salva il segmento corrente e iniziane uno nuovo
                if (currentSegment.length > 0) {
                    segments.push([...currentSegment]);
                    currentSegment = [];
                }
            }

            currentSegment.push(point);
        }
    }

    // Aggiungi l'ultimo segmento se non è vuoto
    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }

    return segments;
};
