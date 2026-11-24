import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  registerDeviceForRemoteMessages,
  AuthorizationStatus 
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import notifee from '@notifee/react-native';
import { notificationDisplay } from './display';
import { notificationListeners } from './listeners';
import { notificationNavigation } from './navigation';

import { storage } from '../utils/storage';

/**
 * Main initialization service for Notifications.
 */
export class NotificationInitialize {
  /**
   * Initializes all notification related configurations.
   * Should be called in App.tsx.
   */
  public async initialize(): Promise<void> {
    // 1. Setup Permissions
    await this.requestPermissions();

    // 2. Register FCM Foreground listener
    notificationListeners.registerListeners();

    // 3. Register Notifee foreground interaction listener
    notifee.onForegroundEvent((event) => {
      notificationNavigation.handleNotificationEvent(event);
    });

    // 4. Handle notification that launched the app (Quit State)
    this.handleInitialNotification();
  }

  /**
   * Background message handler (Headless JS).
   * MUST be registered in index.js.
   */
  public static async backgroundHandler(remoteMessage: any): Promise<void> {
    console.log('[FCM-TEST] Background message received');
    await notificationDisplay.displayNotification(remoteMessage, false);
  }

  /**
   * Checks if the app was launched via a notification press.
   */
  private async handleInitialNotification(): Promise<void> {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('[FCM-TEST] Processing initial notification from quit state');
      notificationNavigation.handleNotificationEvent(initialNotification);
    }
  }

  /**
   * Requests necessary permissions for FCM and Notifee.
   */
  private async requestPermissions(): Promise<void> {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // 1. Check if token already exists in MMKV
      let token = storage.getString('fcm_token');

      if (!token) {
        try {
          // iOS needs APNs registration before an FCM token can be issued.
          if (Platform.OS === 'ios') {
            await registerDeviceForRemoteMessages(messaging);
          }
          // 2. If not, generate new token
          token = await getToken(messaging);
          if (token) {
            // 3. Store the new token in MMKV
            storage.set('fcm_token', token);
            console.log('[FCM] New token generated and stored in MMKV');
          }
        } catch (err) {
          // No token must not stop the listeners from being registered.
          console.warn('[FCM] Could not get a token:', err);
        }
      } else {
        console.log('[FCM] Token retrieved from MMKV');
      }

      console.log('--- FCM TOKEN ---');
      console.log(token);
      console.log('-----------------');
    }

    await notifee.requestPermission();
  }
}

export const notificationInitialize = new NotificationInitialize();
