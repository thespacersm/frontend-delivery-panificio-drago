import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import ActionCell from './ActionCell';

interface EditActionProps<T> {
    row: T;
    onEdit: (row: T) => void;
}

const EditAction = <T extends object>({row, onEdit}: EditActionProps<T>) => {
    return (
        <ActionCell
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-primary-600"/>}
            onClick={() => onEdit(row)}
            title="Modifica"
        />
    );
};

export default EditAction;
