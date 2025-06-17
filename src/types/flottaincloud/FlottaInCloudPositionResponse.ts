import FlottaInCloudPosition from './FlottaInCloudPosition';

interface FlottaInCloudPositionResponse {
    limit: number;
    skip: number;
    data: FlottaInCloudPosition[];
    has_more: boolean;
}

export default FlottaInCloudPositionResponse;
