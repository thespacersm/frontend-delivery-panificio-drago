import React, { useState } from 'react';
import PasswordField from './field/PasswordField';
import { useServices } from '@/servicesContext';

const ChangePasswordForm: React.FC = () => {
    const { userService } = useServices();
    const [formData, setFormData] = useState({
        password: '',
        repeatPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await userService.changePassword(formData.password, formData.repeatPassword);
            setMessage({ text: 'Password cambiata con successo', type: 'success' });
            // Resetta il form dopo il successo
            setFormData({ password: '', repeatPassword: '' });
        } catch (error) {
            setMessage({ 
                text: error instanceof Error ? error.message : 'Si è verificato un errore', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && (
                <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            
            <PasswordField
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Inserisci la nuova password"
            />
            
            <PasswordField
                id="repeatPassword"
                name="repeatPassword"
                label="Ripeti Password"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                placeholder="Conferma la nuova password"
            />

            <div className="mt-6">
                <button
                    type="submit"
                    className={`bg-primary hover:bg-primary cursor-pointer text-white font-medium py-2 px-4 rounded-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Salvataggio...' : 'Aggiorna Password'}
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
