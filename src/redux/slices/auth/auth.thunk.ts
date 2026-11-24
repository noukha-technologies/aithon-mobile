import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser } from './auth.type';
import { clearStorage } from '@utils/storage';

export const login = createAsyncThunk<
    AuthUser,
    { email: string; password: string },
    { rejectValue: string }
> (
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // TODO: replace with real service
            // return await authService.login(email, password);
            throw new Error('Not implemented');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: await authService.logout();
            clearStorage();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

export const initializeAuth = createAsyncThunk<
    AuthUser | null,
    void,
    { rejectValue: string }
> (
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            // Note: Redux Persist with MMKV handles rehydration automatically.
            // Use this thunk for additional checks like token validation if needed.
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Initialization failed');
        }
    }
);