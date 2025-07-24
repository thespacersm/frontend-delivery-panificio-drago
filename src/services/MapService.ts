
import MapClient from '@/clients/MapClient';
import MapNearGeoRequest from '@/types/nearmap/MapNearGeoRequest';
import MapNearGeoResponse from '@/types/nearmap/MapNearGeoResponse';


class MapService {
    private mapClient: MapClient;

    constructor(mapClient: MapClient) {
        this.mapClient = mapClient;
    }

    async mapNearGeo(request: MapNearGeoRequest): Promise<MapNearGeoResponse> {
        return await this.mapClient.mapNearGeo(request);
    }
}

export default MapService;
