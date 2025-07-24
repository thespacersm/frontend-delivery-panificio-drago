import MapNearGeoCoordinate from './MapNearGeoCoordinate';
import MapNearGeoNearestCustomer from './MapNearGeoNearestCustomer';

export default interface MapNearGeoResponseItem {
    point: MapNearGeoCoordinate;
    nearest_customer: MapNearGeoNearestCustomer | null;
}
