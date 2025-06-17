import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import User from '@/types/User';

interface UserState {
    userData: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userData: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User | null>) => {
            state.userData = action.payload;
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
        clearUser: (state) => {
            state.userData = null;
            state.loading = false;
            state.error = null;
        }
    },
});

export const {setUserData, setLoading, setError, clearUser} = userSlice.actions;
export default userSlice.reducer;