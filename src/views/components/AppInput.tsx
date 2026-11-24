import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import AppText from './AppText';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

const AppInput = forwardRef<React.ElementRef<typeof TextInput>, AppInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      editable = true,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label ? (
          <AppText variant="secondary" size={FONT_SIZES.sm} style={styles.label}>
            {label}
          </AppText>
        ) : null}

        <View
          style={[
            styles.inputRow,
            isFocused && styles.inputRowFocused,
            !!error && styles.inputRowError,
            !editable && styles.inputRowDisabled,
          ]}
        >
          {leftElement}
          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={COLORS.placeholder}
            style={[styles.input, inputStyle]}
            onFocus={e => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
          {rightElement}
        </View>

        {error ? (
          <AppText variant="error" size={FONT_SIZES.xs} style={styles.helper}>
            {error}
          </AppText>
        ) : helperText ? (
          <AppText variant="secondary" size={FONT_SIZES.xs} style={styles.helper}>
            {helperText}
          </AppText>
        ) : null}
      </View>
    );
  },
);

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputRowFocused: {
    borderColor: COLORS.borderFocused,
  },
  inputRowError: {
    borderColor: COLORS.status.error,
  },
  inputRowDisabled: {
    backgroundColor: COLORS.disabled,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  helper: {
    marginTop: SPACING.xs,
  },
});

export default AppInput;
