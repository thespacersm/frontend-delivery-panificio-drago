import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
import ActionCell from './ActionCell';

interface MapActionProps<T> {
    row: T;
    onClick: (row: T) => void;
}

const MapAction = <T extends object>({row, onClick}: MapActionProps<T>) => {
    return (
        <ActionCell
            icon={<FontAwesomeIcon icon={faMapMarkedAlt} className="text-green-600"/>}
            onClick={() => onClick(row)}
            title="Visualizza mappa"
        />
    );
};

export default MapAction;
