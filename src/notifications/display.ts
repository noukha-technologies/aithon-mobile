import notifee, { AndroidImportance } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { notificationNavigation } from './navigation';

/**
 * Service to handle the display logic of notifications.
 * It ensures only messages with 'data' and without 'notification' payload are processed.
 */
class NotificationDisplay {
  /**
   * Displays a notification or alert based on the application state.
   * 
   * @param message - The message received from Firebase Cloud Messaging.
   * @param isForeground - Boolean indicating if the app is in the foreground.
   */
  public async displayNotification(
    message: FirebaseMessagingTypes.RemoteMessage,
    isForeground: boolean
  ): Promise<void> {
    // 1. Check if the message has a data object and NO notification object.
    // This prevents Firebase from automatically displaying notifications and 
    // ensures we only handle data-only messages.
    if (!message.data || message.notification) {
      console.log('Notification skipped: Either no data object or contains a notification object.');
      return;
    }

    const title: string = message.data.title || 'New Notification';
    const body: string = message.data.description || '';

    // 2. Handle foreground display using react-native-toast-message.
    if (isForeground) {
      Toast.show({
        type: 'info',
        text1: title,
        text2: body,
        onPress: () => {
          console.log('[NotificationDisplay] Foreground Toast pressed', message.data);
          if (message.data) {
            notificationNavigation.navigateToScreen(message.data);
          }
          Toast.hide();
        }
      });
      return;
    }

    // 3. Handle background/quit display using Notifee.
    await this.displayNotifeeNotification(title, body, message.data);
  }

  /**
   * Displays a notification using Notifee for background/quit states.
   */
  private async displayNotifeeNotification(title: string, body: string, data: any): Promise<void> {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default_channel',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display the notification
    await notifee.displayNotification({
      title: title,
      body: body,
      data: data, // Attach data for interaction handling
      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  }
}

export const notificationDisplay = new NotificationDisplay();
