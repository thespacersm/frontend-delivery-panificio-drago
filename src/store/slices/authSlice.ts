import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;

            if (action.payload) {
                localStorage.setItem('auth_token', action.payload);
            } else {
                localStorage.removeItem('auth_token');
            }
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth_token');
        },
    },
});

export const {setToken, logout} = authSlice.actions;
export default authSlice.reducer;