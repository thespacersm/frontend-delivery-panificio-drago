import WpClient from './WpClient';
import MapNearGeoRequest from '@/types/nearmap/MapNearGeoRequest';
import MapNearGeoResponse from '@/types/nearmap/MapNearGeoResponse';

class MapClient {
    private wpClient: WpClient;

    constructor(wpClient: WpClient) {
        this.wpClient = wpClient;
    }

    async mapNearGeo(request: MapNearGeoRequest): Promise<MapNearGeoResponse> {
        const response = await this.wpClient.post<MapNearGeoResponse>(
            '/wp-json/ts-map/v1/map-near-geo',
            request
        );
        return response.data;
    }
}

export default MapClient;
