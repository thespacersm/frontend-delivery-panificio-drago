import Post from './Post';

interface Media extends Post {
    source_url: string;
    media_type: string;
    mime_type: string;
    media_details: {
        width: number;
        height: number;
        file: string;
        sizes: {
            [key: string]: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            }
        };
        image_meta?: {
            aperture: string;
            credit: string;
            camera: string;
            caption: string;
            created_timestamp: string;
            copyright: string;
            focal_length: string;
            iso: string;
            shutter_speed: string;
            title: string;
            orientation: string;
            keywords: string[];
        };
    };
    alt_text: string;
    description: {
        rendered: string;
        raw: string;
    };
    caption: {
        rendered: string;
        raw: string;
    };
    acf: {
        categories?: string[];
        tags?: string[];
        custom_fields?: {
            [key: string]: any;
        };
    };
}

export default Media;
