import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import activeRouteReducer from './slices/activeRouteSlice';
// Hook personalizzati per TypeScript
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        activeRoute: activeRouteReducer,
    },
});

// Definisco i tipi per lo state e per il dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;