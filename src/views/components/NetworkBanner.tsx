import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Animated, Platform, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '@config/colors.config';
import AppText from './AppText';

export const NetworkBanner = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const showBanner = useCallback(() => {
    setIsVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [animation]);

  const hideBanner = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  }, [animation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isInternetReachable !== false;
      setIsOnline(online);

      if (!online) {
        showBanner();
      } else {
        hideBanner();
      }
    });

    const errorListener = DeviceEventEmitter.addListener('network_error', () => {
      showBanner();
    });

    return () => {
      unsubscribe();
      errorListener.remove();
    };
  }, [showBanner, hideBanner]);

  if (!isVisible && isOnline !== false) return null;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Increased to ensure it's off-screen
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }], opacity }]}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.statusDot} />
            <View style={styles.textContainer}>
              <AppText style={styles.title} bold>No Connection</AppText>
              <AppText style={styles.subtitle}>Check your internet settings</AppText>
            </View>
            <TouchableOpacity
              onPress={hideBanner}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <AppText style={styles.closeIcon}>✕</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 80, // Floating above bottom bar
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  safeArea: {
    width: '100%',
  },
  container: {
    backgroundColor: '#1A1A1A', // Sleek dark snackbar
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.6,
  },
});
