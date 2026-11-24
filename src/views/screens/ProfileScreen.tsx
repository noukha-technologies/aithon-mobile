import React, { useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@config/colors.config';
import AppText from '@views/components/AppText';
import { useAppSelector, useAppDispatch } from '@redux/hooks';
import { selectUser } from '@redux/slices/auth/auth.selector';
import { logout } from '@redux/slices/auth/auth.thunk';
import { useNavigation } from '@react-navigation/native';
import { useFcmToken } from '@hooks/getFcmToken';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  const { fcmToken, loading, error } = useFcmToken();

  useEffect(() => {
    if (fcmToken) {
      console.log('✅ FCM Token:', fcmToken);
    }
    if (error) {
      console.log('❌ FCM Error:', error);
    }
  }, [fcmToken, error]);

  return (
    <View style={[styles.mainContainer, { 
      paddingTop: insets.top, 
      paddingLeft: insets.left,
      paddingRight: insets.right 
    }]}>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <AppText bold size={24} style={styles.title}>Profile</AppText>
        <View style={styles.content}>
            <View style={styles.infoCard}>
                <AppText variant="secondary">Name</AppText>
                <AppText bold size={18}>{user?.name ?? 'N/A'}</AppText>
            </View>
            
            <View style={styles.infoCard}>
                <AppText variant="secondary">Email</AppText>
                <AppText bold size={18}>{user?.email ?? 'N/A'}</AppText>
            </View>

            <View style={styles.infoCard}>
                <AppText variant="secondary">{t('language')}</AppText>
                <View style={styles.languageContainer}>
                  <TouchableOpacity 
                    style={[styles.langButton, i18n.language === 'en' && styles.activeLang]}
                    onPress={() => changeLanguage('en')}
                  >
                    <AppText bold={i18n.language === 'en'}>{t('english')}</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.langButton, i18n.language === 'tn' && styles.activeLang]}
                    onPress={() => changeLanguage('tn')}
                  >
                    <AppText bold={i18n.language === 'tn'}>{t('tamil')}</AppText>
                  </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <AppText style={styles.logoutText}>{t('logout')}</AppText>
            </TouchableOpacity>
            
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>FCM Token Status:</Text>
              {loading ? (
                <Text style={styles.tokenValue}>Loading...</Text>
              ) : error ? (
                <Text style={[styles.tokenValue, { color: 'red' }]}>{error}</Text>
              ) : (
                <Text 
                  numberOfLines={2} 
                  selectable 
                  style={styles.tokenValue}
                >
                  {fcmToken || 'No Token'}
                </Text>
              )}
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutButton: {
    marginTop: 'auto',
    height: 56,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC1C1',
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  tokenContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 20,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 5,
  },
  tokenValue: {
    fontSize: 12,
    color: COLORS.text.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeLang: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  }
});

export default ProfileScreen;
