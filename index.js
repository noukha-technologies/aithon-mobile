/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { NotificationInitialize } from './src/notifications/initialize';
import { notificationNavigation } from './src/notifications/navigation';
import './src/i18n';

// Register the Firebase background message handler (Modular API)
const messaging = getMessaging();
setBackgroundMessageHandler(messaging, NotificationInitialize.backgroundHandler);

// Register the Notifee background event handler (for interactions when app is closed)
notifee.onBackgroundEvent(async (event) => {
  await notificationNavigation.handleNotificationEvent(event);
});

AppRegistry.registerComponent(appName, () => App);
