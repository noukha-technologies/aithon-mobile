import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './auth.type';
import { login, logout, initializeAuth } from './auth.thunk';

const initialState: AuthState = {
    user: null,
    loading: false,
    initializing: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Login failed';
            })

            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
            })

            // initializeAuth
            .addCase(initializeAuth.pending, (state) => {
                state.initializing = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.initializing = false;
                state.user = action.payload;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.initializing = false;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;