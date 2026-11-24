import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Global navigation function that can be used outside of React components.
 * Handles cases where the navigator might not be ready yet.
 */
export function navigate(name: keyof RootStackParamList | string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  } else {
    console.warn(`[RootNavigation] Ref not ready, queuing navigation to: ${name}`);
    
    // Retry logic for cold starts (e.g. quit state)
    let retryCount = 0;
    const interval = setInterval(() => {
      retryCount++;
      if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
        clearInterval(interval);
      } else if (retryCount > 10) { // Stop after 5 seconds
        console.error(`[RootNavigation] Failed to navigate to ${name} after multiple retries.`);
        clearInterval(interval);
      }
    }, 500);
  }
}
