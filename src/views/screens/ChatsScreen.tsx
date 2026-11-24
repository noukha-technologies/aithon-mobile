import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@config/colors.config';
import AppText from '@views/components/AppText';

const ChatsScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { 
      paddingTop: insets.top, 
    }]}>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <AppText bold size={20}>Chats</AppText>
      </View>
      <View style={styles.content}>
        <AppText variant="secondary">Messages will appear here</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatsScreen;
