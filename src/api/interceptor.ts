import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { DeviceEventEmitter } from "react-native";

// Base URL from ENV
const api = axios.create({
    baseURL: Config.API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});


/* --------------------------
   Inject Access Token
--------------------------- */
api.interceptors.request.use(async (config) => {
    // Skip Authorization header for login endpoint
    if (config.url?.endsWith("account/login")) {
        return config;
    }

    try {
        const token =
            (await AsyncStorage.getItem("AccessToken")) ||
            (await AsyncStorage.getItem("accessToken"));

        console.log('[Interceptor] Getting AccessToken from AsyncStorage');
        console.log('[Interceptor] AccessToken:', token ? 'Found' : 'Not found');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        console.log('[Interceptor] Error getting AccessToken:', e);
    }

    return config;
});

/* --------------------------
   Refresh Token Handling
--------------------------- */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Do NOT attempt refresh for login or logout endpoints
        if (originalRequest?.url?.endsWith("account/login") || originalRequest?.url?.endsWith("logout")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                console.log(`[Refresh Token] Request for ${originalRequest.url} queued while refreshing...`);
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            console.log("[Refresh Token] Initiating refresh...");

            try {
                const refreshToken =
                    (await AsyncStorage.getItem("RefreshToken")) ||
                    (await AsyncStorage.getItem("refreshToken"));

                if (!refreshToken) {
                    console.log("[Refresh Token] Failed: No refresh token available in storage.");
                    throw new Error("No refresh token available");
                }

                const refreshPath = "/core/public/v1/account/refresh-token";

                const refreshResponse = await axios.post(
                    `${Config.API_URL?.replace(/\/+$/, "")}${refreshPath}`,
                    { refresh_token: refreshToken }
                );

                const data = refreshResponse.data?.data || refreshResponse.data;
                const newAccessToken = data.access_token || data.accessToken;

                if (newAccessToken) {
                    console.log("[Refresh Token] Success! New access token obtained.");
                    await AsyncStorage.setItem("AccessToken", newAccessToken);

                    api.defaults.headers.Authorization = "Bearer " + newAccessToken;

                    processQueue(null, newAccessToken);

                    originalRequest.headers.Authorization =
                        "Bearer " + newAccessToken;

                    return api(originalRequest);
                } else {
                    console.log("[Refresh Token] Failed: No access token in refresh response.");
                }
            } catch (err: any) {
                console.log("[Refresh Token] Failed:", err.message || err);
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        if (!error.response) {
            const state = await NetInfo.fetch();
            if (state.isInternetReachable === false) {
                console.log("[Interceptor] Network Error: Internet not reachable.");
                DeviceEventEmitter.emit('network_error');
                error.message = "No internet connection. Please check your network settings.";
            }
        }

        return Promise.reject(error);
    }
);

export default api;