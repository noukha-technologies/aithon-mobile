import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import AppText from './AppText';

type PickerMode = 'date' | 'time' | 'datetime';

interface AppDatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode?: PickerMode;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  formatValue?: (date: Date) => string;
}

const defaultFormat = (date: Date, mode: PickerMode) => {
  if (mode === 'time') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (mode === 'datetime') return date.toLocaleString();
  return date.toLocaleDateString();
};

// Field that opens the native date-picker modal on tap. The visible control
// is a read-only AppInput-styled row — the actual spinner lives in the modal
// react-native-date-picker renders, so this stays a single controlled value.
const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  formatValue,
}) => {
  const [open, setOpen] = useState(false);

  const displayText = value
    ? (formatValue ?? ((d: Date) => defaultFormat(d, mode)))(value)
    : placeholder;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="secondary" size={FONT_SIZES.sm} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.75}
        disabled={disabled}
        style={[
          styles.field,
          !!error && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}
        onPress={() => setOpen(true)}
      >
        <AppText
          variant={value ? 'primary' : 'secondary'}
          size={FONT_SIZES.md}
        >
          {displayText}
        </AppText>
      </TouchableOpacity>

      {error ? (
        <AppText variant="error" size={FONT_SIZES.xs} style={styles.helper}>
          {error}
        </AppText>
      ) : null}

      <DatePicker
        modal
        mode={mode}
        open={open}
        date={value ?? new Date()}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={date => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  field: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  fieldError: {
    borderColor: COLORS.status.error,
  },
  fieldDisabled: {
    backgroundColor: COLORS.disabled,
  },
  helper: {
    marginTop: SPACING.xs,
  },
});

export default AppDatePicker;
