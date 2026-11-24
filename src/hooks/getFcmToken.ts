import { useState, useEffect } from 'react';
import { 
  getMessaging, 
  getToken, 
  registerDeviceForRemoteMessages 
} from '@react-native-firebase/messaging';
import { NotificationPermissionService } from '../services/permissions/notification.permission';
import { RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

/**
 * Hook to handle notification permission and retrieve FCM token
 */
export const useFcmToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getDeviceToken = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check/Request Notification Permission
      const { status } = await NotificationPermissionService.requestPermission();

      if (status !== RESULTS.GRANTED) {
        console.log('[useFcmToken] Permission not granted:', status);
        setError(`Permission ${status}`);
        setLoading(false);
        return null;
      }

      const messaging = getMessaging();

      // 2. Register for remote messages (Required for iOS)
      if (Platform.OS === 'ios') {
        await registerDeviceForRemoteMessages(messaging);
      }

      // 3. Get FCM Token
      const token = await getToken(messaging);
      
      if (token) {
        console.log('[useFcmToken] FCM Token retrieved successfully');
        setFcmToken(token);
        return token;
      } else {
        setError('Failed to get FCM token');
        return null;
      }
    } catch (err: any) {
      console.error('[useFcmToken] Error getting FCM token:', err);
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeviceToken();
  }, []);

  return {
    fcmToken,
    loading,
    error,
    refreshTokens: getDeviceToken,
  };
};
