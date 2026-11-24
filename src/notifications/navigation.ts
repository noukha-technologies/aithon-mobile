import { Event, EventType, InitialNotification, Notification } from '@notifee/react-native';
import * as RootNavigation from '../navigation/RootNavigation';

/**
 * Defines the mapping between notification types and app screens.
 */
const NOTIFICATION_SCREEN_MAP: Record<string, string> = {
  'chats': 'Chats',
  'chat': 'Chats',
  'posts': 'Posts',
  'post': 'Posts',
  'profile': 'Profile',
  'home': 'Home',
};

/**
 * Service to handle navigation and actions when a notification is interacted with.
 */
class NotificationNavigation {
  /**
   * Handles Notifee events (foreground/background) or initial notifications (quit state).
   * 
   * @param input - The Notifee event or InitialNotification object.
   */
  public async handleNotificationEvent(input: Event | InitialNotification): Promise<void> {
    const isInitial = this.isInitialNotification(input);
    const notification = isInitial 
      ? (input as InitialNotification).notification 
      : (input as Event).detail.notification;
    
    const type = isInitial ? null : (input as Event).type;

    // Handle only press actions
    if (isInitial || type === EventType.PRESS) {
      console.log(`[NotificationNavigation] Processing ${isInitial ? 'INITIAL' : 'PRESS'} event`);
      
      const data = notification?.data;
      if (data) {
        this.navigateToScreen(data);
      }
    }
  }

  /**
   * Logic to navigate to specific screens based on notification data.
   */
  public navigateToScreen(data: Record<string, any>): void {
    const notificationType = data.notificationType as string;
    const screenName = NOTIFICATION_SCREEN_MAP[notificationType] || 'Home';

    console.log(`[NotificationNavigation] Routing ${notificationType} -> ${screenName}`);

    // Navigate to the screen within the Main stack
    RootNavigation.navigate('Main', { 
      screen: screenName,
      params: data.payload ? JSON.parse(data.payload) : undefined
    });
  }

  /**
   * Helper to distinguish between an Event and an InitialNotification.
   */
  private isInitialNotification(input: any): input is InitialNotification {
    return !!input.notification && !input.type;
  }
}

export const notificationNavigation = new NotificationNavigation();
