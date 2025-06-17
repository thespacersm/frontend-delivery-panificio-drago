import Post from './Post';

interface Vehicle extends Post {
    class_list: string[];
    acf: {
        plate: string;
        imei: string;
    };
}

export default Vehicle;
