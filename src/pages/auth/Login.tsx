import React, {useState} from 'react';
import {useServices} from '@/servicesContext';
import {useNavigate} from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Utilizziamo il contesto dei servizi per accedere all'authService
    const {authService} = useServices();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authService.login(username, password);
            // Login riuscito, reindirizza alla dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Errore di login:', err);
            setError('Username o password non validi. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-100 px-4 py-16 pt-0">
            <img 
                src="/logo-h.png" 
                alt="Panificio Drago Logo" 
                className="h-20 w-auto mb-4"
            />
            <div className="w-full max-w-md p-6 space-y-4 bg-boxwhite-100 rounded shadow-md">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold text-center text-gray-800">Login</h1>
                </div>
                <p className="text-sm text-center text-gray-600">Benvenuto! Effettua il login per continuare.</p>

                {error && (
                    <div className="p-2 text-sm text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-primary-300"
                    >
                        {isLoading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;