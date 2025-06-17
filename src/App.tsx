// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './app.css'
import AppRouter from './router';
import {ServicesProvider} from './servicesContext';
import {Provider} from 'react-redux';
import {store} from './store';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ServicesProvider>
                <AppRouter/>
            </ServicesProvider>
        </Provider>
    );
};

export default App;
