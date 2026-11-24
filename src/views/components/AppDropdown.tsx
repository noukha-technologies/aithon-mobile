import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import AppText from './AppText';

interface AppDropdownOption {
  label: string;
  value: string | number;
  [key: string]: unknown;
}

interface AppDropdownProps {
  label?: string;
  data: AppDropdownOption[];
  value?: string | number | null;
  onChange: (item: AppDropdownOption) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  search?: boolean;
}

// Thin wrapper around react-native-element-dropdown pinned to our token
// label/value field names so every dropdown in the app looks the same.
const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  data,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
  search = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="secondary" size={FONT_SIZES.sm} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <Dropdown
        style={[
          styles.dropdown,
          !!error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        containerStyle={styles.listContainer}
        placeholderStyle={styles.placeholderText}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.itemText}
        activeColor={COLORS.primaryLight}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value ?? null}
        disable={disabled}
        search={search}
        searchPlaceholder="Search..."
        onChange={item => onChange(item as AppDropdownOption)}
      />

      {error ? (
        <AppText variant="error" size={FONT_SIZES.xs} style={styles.helper}>
          {error}
        </AppText>
      ) : null}
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
  dropdown: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
  },
  dropdownError: {
    borderColor: COLORS.status.error,
  },
  dropdownDisabled: {
    backgroundColor: COLORS.disabled,
  },
  listContainer: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholderText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.placeholder,
  },
  selectedText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  itemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  helper: {
    marginTop: SPACING.xs,
  },
});

export default AppDropdown;
export type { AppDropdownOption };
