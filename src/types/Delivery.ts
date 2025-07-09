import Post from './Post';

interface Delivery extends Post {
    class_list: string[];
    acf: {
        sea_id: string;
        zone_sea_id: string;
        zone_id: string;
        date: string;
        zone_name: string;
        carrier_name: string;
        vehicle_name: string;
        sea_customer_code: string;
        customer_id: string;
        document: string;
        article_count: number;
        weighted_article_count: number;
        qty: number;
        weighted_qty: number;
        is_prepared: boolean;
        is_loaded: boolean;
        is_delivered: boolean;
        is_prepared_date?: string;
        is_loaded_date?: string;
        is_delivered_date?: string;
        gallery: number[];
    };
}

export default Delivery;
