import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@config/toast.config';
import { useAppDispatch } from './redux/hooks';
import { initializeAuth } from './redux/slices/auth/auth.thunk';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '@config/colors.config';
import BootSplash from 'react-native-bootsplash';
import { NetworkBanner } from './views/components/NetworkBanner';

const AppContent = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return <>{children}</>;
};

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <AppContent>
                {children}
              </AppContent>
              <NetworkBanner />
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};
