export const acl = {
    // Permessi veicoli
    VEHICLE_CREATE: "vehicle:create",
    VEHICLE_READ: "vehicle:read",
    VEHICLE_LIST: "vehicle:list",
    VEHICLE_EDIT: "vehicle:edit",
    VEHICLE_DELETE: "vehicle:delete",
    VEHICLE_MAP: "vehicle:map",
    
    // Permessi clienti
    CUSTOMER_CREATE: "customer:create",
    CUSTOMER_READ: "customer:read",
    CUSTOMER_LIST: "customer:list",
    CUSTOMER_EDIT: "customer:edit",
    CUSTOMER_DELETE: "customer:delete",
    
    // Permessi zone
    ZONE_CREATE: "zone:create",
    ZONE_READ: "zone:read",
    ZONE_LIST: "zone:list",
    ZONE_EDIT: "zone:edit",
    ZONE_DELETE: "zone:delete",
    
    // Permessi consegne
    DELIVERY_CREATE: "delivery:create",
    DELIVERY_READ: "delivery:read",
    DELIVERY_LIST: "delivery:list",
    DELIVERY_EDIT: "delivery:edit",
    DELIVERY_DELETE: "delivery:delete",
    DELIVERY_PREPARE: "delivery:prepare",
    DELIVERY_LOAD: "delivery:load",
    DELIVERY_DELIVER: "delivery:deliver",
    DELIVERY_ADVANCED_VIEW: "delivery:advanced_view",
    
    // Permessi percorsi
    ROUTE_CREATE: "route:create",

    // Permessi media
    MEDIA_CREATE: "media:create",
    MEDIA_READ: "media:read",
    MEDIA_LIST: "media:list",
    MEDIA_EDIT: "media:edit",
    MEDIA_DELETE: "media:delete",
}

export const getAllPermissions = () => {
    return Object.values(acl);
}

export const getAdministratorPermissions = () => {
    let allPermissions = getAllPermissions();
    return allPermissions.filter(permission =>
        // remove ROUTE_CREATE
        permission !== acl.ROUTE_CREATE
    )
}

// Mappa ruoli-permessi
export const rolePermissions: Record<string, string[]> = {
    'carrier': [
        acl.VEHICLE_LIST,
        acl.CUSTOMER_LIST,
        acl.CUSTOMER_CREATE,
        acl.CUSTOMER_EDIT,
        acl.ZONE_LIST,
        acl.ZONE_READ,
        acl.DELIVERY_LIST,
        acl.DELIVERY_READ,
        acl.DELIVERY_PREPARE,
        acl.DELIVERY_LOAD,
        acl.DELIVERY_DELIVER,
        acl.ROUTE_CREATE,
        acl.MEDIA_LIST,
        acl.MEDIA_READ,
    ],
    'administrator': getAdministratorPermissions(),
    // Altri ruoli...
};