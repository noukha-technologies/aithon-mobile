import React, { useEffect } from 'react';
import { AppWrapper } from './AppWrapper';
import AppNavigator from './navigation/NavigationRoutes';
import { notificationInitialize } from './notifications/initialize';

function App() {
  useEffect(() => {
    // Initialize notification listeners and permissions
    notificationInitialize.initialize();
  }, []);

  return (
    <AppWrapper>
      <AppNavigator />
    </AppWrapper>
  );
}

export default App;
