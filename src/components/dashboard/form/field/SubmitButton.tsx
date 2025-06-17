import React from 'react';

interface SubmitButtonProps {
    isSubmitting: boolean;
    submitLabel: string;
    loadingLabel?: string;
    fullWidth?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
                                                       isSubmitting,
                                                       submitLabel = 'Invia',
                                                       loadingLabel = 'Invio in corso...',
                                                       fullWidth = false
                                                   }) => {
    return (
        <div>
            <button
                type="submit"
                disabled={isSubmitting}
                className={`${fullWidth ? 'w-full' : ''} flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting ? 'bg-primary' : 'bg-primary hover:bg-primary-700 cursor-pointer'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
                {isSubmitting ? loadingLabel : submitLabel}
            </button>
        </div>
    );
};

export default SubmitButton;
