import { getMessaging, onMessage, onTokenRefresh, FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { notificationDisplay } from './display';
import { storage } from '../utils/storage';

/**
 * Service to register Firebase Cloud Messaging listeners.
 */
class NotificationListeners {
  /**
   * Registers foreground and background listeners.
   */
  public registerListeners(): void {
    const messaging = getMessaging();

    // 1. Foreground message listener
    onMessage(messaging, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('[FCM-TEST] Foreground message received');
      await notificationDisplay.displayNotification(remoteMessage, true);
    });

    // 2. Token refresh listener
    onTokenRefresh(messaging, (token) => {
      storage.set('fcm_token', token);
      console.log('[FCM] Token refreshed and updated in MMKV');
    });

    // 3. Background/Quit state message listener
    // This is handled via setBackgroundMessageHandler in initialize.ts
  }
}

export const notificationListeners = new NotificationListeners();
