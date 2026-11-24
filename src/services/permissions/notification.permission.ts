import { Platform, Alert } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
  openSettings,
  PermissionStatus,
  NotificationSettings,
} from 'react-native-permissions';

/**
 * Service to handle Notification Permissions for both Android and iOS
 * Using specialized checkNotifications and requestNotifications APIs
 */
export class NotificationPermissionService {
  /**
   * Check current notification permission status and settings
   */
  static async checkPermission(): Promise<{
    status: PermissionStatus;
    settings: NotificationSettings;
  }> {
    try {
      const result = await checkNotifications();
      console.log(`[NotificationPermission] Check status: ${result.status}`, result.settings);
      return result;
    } catch (error) {
      console.error('[NotificationPermission] Check error:', error);
      return {
        status: RESULTS.UNAVAILABLE,
        settings: {},
      };
    }
  }

  /**
   * Request notification permission
   * Handles asking, and redirects to settings if blocked
   */
  static async requestPermission(): Promise<{
    status: PermissionStatus;
    settings: NotificationSettings;
  }> {
    try {
      const { status, settings } = await this.checkPermission();

      if (status === RESULTS.GRANTED) {
        return { status, settings };
      }

      if (status === RESULTS.DENIED) {
        // Request with standard options
        const result = await requestNotifications(['alert', 'badge', 'sound']);
        return result;
      }

      if (status === RESULTS.BLOCKED) {
        this.showSettingsAlert();
        return { status, settings };
      }

      return { status, settings };
    } catch (error) {
      console.error('[NotificationPermission] Request error:', error);
      return {
        status: RESULTS.UNAVAILABLE,
        settings: {},
      };
    }
  }

  /**
   * Show alert to redirect user to app settings
   */
  private static showSettingsAlert() {
    Alert.alert(
      'Notification Permission',
      'Notifications are currently blocked. Please enable them in settings to receive updates.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => openSettings(),
        },
      ],
    );
  }
}
