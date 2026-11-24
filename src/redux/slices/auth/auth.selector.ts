import { RootState } from '../../store';

export const selectUser             = (s: RootState) => s.auth.user;
export const selectIsLoggedIn       = (s: RootState) => !!s.auth.user;
export const selectAuthLoading      = (s: RootState) => s.auth.loading;
export const selectAuthInitializing = (s: RootState) => s.auth.initializing;
export const selectAuthError        = (s: RootState) => s.auth.error;