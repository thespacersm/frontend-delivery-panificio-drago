import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardIndex from './pages/dashboard/DashboardIndex';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import LoginRoute from './components/routes/LoginRoute';
import VehiclesIndex from './pages/dashboard/vehicles/VehiclesIndex';
import VehiclesCreate from './pages/dashboard/vehicles/VehiclesCreate';
import VehiclesUpdate from './pages/dashboard/vehicles/VehiclesEdit';
import VehiclesMap from './pages/dashboard/vehicles/VehiclesMap';
import CustomersIndex from './pages/dashboard/customers/CustomersIndex';
import CustomersCreate from './pages/dashboard/customers/CustomersCreate';
import CustomersEdit from './pages/dashboard/customers/CustomersEdit';
import ZonesIndex from './pages/dashboard/zones/ZonesIndex';
import ZonesCreate from './pages/dashboard/zones/ZonesCreate';
import ZonesEdit from './pages/dashboard/zones/ZonesEdit';
import SettingsIndex from './pages/dashboard/settings/SettingsIndex';
import RoutesCreate from './pages/dashboard/routes/RoutesCreate';
import RoutesView from './pages/dashboard/routes/RoutesView';
import DeliveriesIndex from './pages/dashboard/deliveries/DeliveriesIndex';
import DeliveriesCreate from './pages/dashboard/deliveries/DeliveriesCreate';
import DeliveriesEdit from './pages/dashboard/deliveries/DeliveriesEdit';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <LoginRoute>
                        <Login/>
                    </LoginRoute>
                }/>

                {/* Rotte dashboard con layout condiviso e protezione */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout/>
                    </ProtectedRoute>
                }>
                    <Route index element={<DashboardIndex/>}/>
                    
                    {/* Rotte veicoli */}
                    <Route path="vehicles" element={<VehiclesIndex/>}/>
                    <Route path="vehicles/new" element={<VehiclesCreate/>}/>
                    <Route path="vehicles/:id/edit" element={<VehiclesUpdate/>}/>
                    <Route path="vehicles/:id/map" element={<VehiclesMap/>}/>
                    
                    {/* Rotte clienti */}
                    <Route path="customers" element={<CustomersIndex/>}/>
                    <Route path="customers/new" element={<CustomersCreate/>}/>
                    <Route path="customers/:id/edit" element={<CustomersEdit/>}/>

                    {/* Rotte zone */}
                    <Route path="zones" element={<ZonesIndex/>}/>
                    <Route path="zones/new" element={<ZonesCreate/>}/>
                    <Route path="zones/:id/edit" element={<ZonesEdit/>}/>

                    {/* Rotte consegne */}
                    <Route path="deliveries" element={<DeliveriesIndex/>}/>
                    <Route path="deliveries/new" element={<DeliveriesCreate/>}/>
                    <Route path="deliveries/:id/edit" element={<DeliveriesEdit/>}/>

                    {/* Rotte percorsi */}
                    <Route path="routes/new" element={<RoutesCreate/>}/>
                    <Route path="routes/current" element={<RoutesView/>}/>
                    
                    {/* Altre rotte */}
                    <Route path="settings" element={<SettingsIndex/>}/>
                    {/* Qui puoi aggiungere altre rotte figlie della dashboard */}
                </Route>

                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </Router>
    );
};

export default AppRouter;