import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import ActionCell from './ActionCell';

interface DeleteActionProps<T> {
    row: T;
    onDelete: (row: T) => void;
    confirmMessage?: (row: T) => string;
}

const DeleteAction = <T extends object>({
                                            row,
                                            onDelete,
                                            confirmMessage = () => 'Sei sicuro di voler eliminare questo elemento?'
                                        }: DeleteActionProps<T>) => {

    const handleDelete = () => {
        if (window.confirm(confirmMessage(row))) {
            onDelete(row);
        }
    };

    return (
        <ActionCell
            icon={<FontAwesomeIcon icon={faTrash} className="text-red-600"/>}
            onClick={handleDelete}
            title="Elimina"
        />
    );
};

export default DeleteAction;
