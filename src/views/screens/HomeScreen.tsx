import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Config from 'react-native-config';
import { COLORS } from '@config/colors.config';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { hs, ms, ws } from '@config/measurements.config';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Something went wrong');
    } else if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri || null);
    }
  };

  return (
    <View style={[styles.mainContainer, { 
      paddingTop: insets.top, 
      paddingLeft: insets.left,
      paddingRight: insets.right 
    }]}>
      <StatusBar
        barStyle="dark-content"
      />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: hs(40) }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header/Env Area */}
        <View style={styles.header}>
          <Text style={styles.envLabel}>Environment</Text>
          <Text style={styles.envValue}>{Config.ENVIRONMENT_NAME}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            {t('welcome')}
          </Text>
          <Text style={styles.subtitle}>
            {t('subtitle')}
          </Text>

          {/* Preview Area */}
          <View style={styles.previewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>{t('no_image_selected')}</Text>
              </View>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => {
                setImageUri(null)
                Toast.show({
                  type: 'success',
                  text1: 'Image cleared',
                  text2: 'Image cleared successfully',
                })
              }}
            >
              <Text style={styles.buttonText}>{t('clear')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleSelectImage}
            >
              <Text style={styles.buttonText}>{t('select_image')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ws(16),
    gap: ms(20),
    paddingTop: hs(20),
  },
  header: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  envLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  envValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
