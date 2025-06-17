import Post from './Post';

interface Zone extends Post {
    class_list: string[];
    acf: {
        sea_id: string;
        warehouse_id: string;
    };
}

export default Zone;
