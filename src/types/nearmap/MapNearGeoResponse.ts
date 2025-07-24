import MapNearGeoResponseItem from './MapNearGeoResponseItem';

export default interface MapNearGeoResponse {
    status: string;
    message: string;
    points_with_customers: MapNearGeoResponseItem[];
}
