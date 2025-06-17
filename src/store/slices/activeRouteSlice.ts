import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Route from '@/types/Route';

interface ActiveRouteState {
    routeData: Route | null;
    loading: boolean;
    error: string | null;
}

const initialState: ActiveRouteState = {
    routeData: null,
    loading: false,
    error: null,
};

const activeRouteSlice = createSlice({
    name: 'activeRoute',
    initialState,
    reducers: {
        setActiveRoute: (state, action: PayloadAction<Route | null>) => {
            state.routeData = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearActiveRoute: (state) => {
            state.routeData = null;
            state.loading = false;
            state.error = null;
        }
    },
});

export const { setActiveRoute, setLoading, setError, clearActiveRoute } = activeRouteSlice.actions;
export default activeRouteSlice.reducer;
