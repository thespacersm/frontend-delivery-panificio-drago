import React, {createContext, useContext} from 'react';
import UserClient from './clients/UserClient';
import AuthClient from './clients/AuthClient';
import VehicleClient from './clients/VehicleClient';
import CustomerClient from './clients/CustomerClient';
import ZoneClient from './clients/ZoneClient';
import FlottaInCloudClient from './clients/FlottaInCloudClient';
import RouteClient from './clients/RouteClient';
import DeliveryClient from './clients/DeliveryClient';
import WpClient from './clients/WpClient';
import MediaClient from './clients/MediaClient';
import AuthService from './services/AuthService';
import UserService from './services/UserService';
import VehicleService from './services/VehicleService';
import CustomerService from './services/CustomerService';
import ZoneService from './services/ZoneService';
import FlottaInCloudService from './services/FlottaInCloudService';
import RouteService from './services/RouteService';
import DeliveryService from './services/DeliveryService';
import MediaService from './services/MediaService';

// Create the context
const ServicesContext = createContext<{
    authService: AuthService;
    userService: UserService;
    vehicleService: VehicleService;
    customerService: CustomerService;
    zoneService: ZoneService;
    flottaInCloudService: FlottaInCloudService;
    routeService: RouteService;
    deliveryService: DeliveryService;
    mediaService: MediaService;
    wpClient: WpClient;
} | null>(null);

// Create a provider component
export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // Initialize clients with base URLs from the environment
    const backendBaseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL || '';
    const flottaInCloudBaseUrl = import.meta.env.VITE_FLOTTAINCLOUD_BASE_URL || '';
    const flottaInCloudUsername = import.meta.env.VITE_FLOTTAINCLOUD_USERNAME || '';
    const flottaInCloudToken = import.meta.env.VITE_FLOTTAINCLOUD_TOKEN || '';

    // Creiamo i client direttamente con le loro baseURL
    const authClient = new AuthClient(backendBaseUrl);
    const wpClient = new WpClient(backendBaseUrl);
    const userClient = new UserClient(wpClient);
    const vehicleClient = new VehicleClient(wpClient);
    const customerClient = new CustomerClient(wpClient);
    const zoneClient = new ZoneClient(wpClient);
    const routeClient = new RouteClient(wpClient);
    const deliveryClient = new DeliveryClient(wpClient);
    const mediaClient = new MediaClient(wpClient);
    const flottaInCloudClient = new FlottaInCloudClient(flottaInCloudBaseUrl, flottaInCloudUsername, flottaInCloudToken);

    const authService = new AuthService(authClient);
    const userService = new UserService(userClient);
    const vehicleService = new VehicleService(vehicleClient);
    const customerService = new CustomerService(customerClient);
    const zoneService = new ZoneService(zoneClient);
    const flottaInCloudService = new FlottaInCloudService(flottaInCloudClient);
    const routeService = new RouteService(routeClient);
    const deliveryService = new DeliveryService(deliveryClient);
    const mediaService = new MediaService(mediaClient);

    // Provide the services via context
    return (
        <ServicesContext.Provider value={{
            authService,
            userService,
            vehicleService,
            customerService,
            zoneService,
            flottaInCloudService,
            routeService,
            deliveryService,
            mediaService,
            wpClient
        }}>
            {children}
        </ServicesContext.Provider>
    );
};

// Custom hook to use the services
export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};