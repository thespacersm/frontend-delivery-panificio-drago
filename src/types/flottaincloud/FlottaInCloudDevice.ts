interface FlottaInCloudDevice {
    imei: string;
    name: string;
    numeric_label: number;
    timestamp_activation: number;
    lng: number;
    lat: number;
    heading: number;
    odometer: number;
    altitude: number;
    speed: number;
    satellites: number;
    moving: boolean;
    timestamp_position: number;
    timestamp_last_trip_change: number;
    has_GPS: boolean;
    is_connected: boolean;
    is_power_on: boolean;
}

export default FlottaInCloudDevice;
