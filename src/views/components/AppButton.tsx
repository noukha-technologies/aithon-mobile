import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import AppText from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SIZE_STYLES: Record<ButtonSize, { paddingVertical: number; fontSize: number }> = {
  sm: { paddingVertical: SPACING.sm, fontSize: FONT_SIZES.sm },
  md: { paddingVertical: SPACING.md, fontSize: FONT_SIZES.base },
  lg: { paddingVertical: SPACING.lg, fontSize: FONT_SIZES.md },
};

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}) => {
  const isDisabled = disabled || loading;
  const variantStyle = getVariantStyle(variant, isDisabled);
  const sizeStyle = SIZE_STYLES[size];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      activeOpacity={0.75}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        { paddingVertical: sizeStyle.paddingVertical },
        variantStyle.container,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} />
      ) : (
        <>
          {leftIcon}
          <AppText
            style={[
              { fontSize: sizeStyle.fontSize, color: variantStyle.textColor },
              (leftIcon || rightIcon) ? styles.labelWithIcon : null,
            ]}
            bold
          >
            {label}
          </AppText>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

function getVariantStyle(variant: ButtonVariant, isDisabled: boolean) {
  if (isDisabled) {
    return {
      container: { backgroundColor: COLORS.disabled, borderWidth: 0 },
      textColor: COLORS.text.disabled,
    };
  }

  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: COLORS.primary, borderWidth: 0 },
        textColor: COLORS.white,
      };
    case 'secondary':
      return {
        container: { backgroundColor: COLORS.secondary, borderWidth: 0 },
        textColor: COLORS.white,
      };
    case 'outline':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
        textColor: COLORS.primary,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 0 },
        textColor: COLORS.primary,
      };
    case 'danger':
      return {
        container: { backgroundColor: COLORS.status.error, borderWidth: 0 },
        textColor: COLORS.white,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  labelWithIcon: {
    marginHorizontal: SPACING.xs,
  },
});

export default AppButton;
