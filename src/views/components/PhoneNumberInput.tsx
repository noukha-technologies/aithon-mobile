import React, { useMemo } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  CountryCode,
} from '@config/countryCodes.config';
import AppText from './AppText';

export interface PhoneNumberValue {
  countryCode: string; // e.g. "+91"
  number: string;      // national number, digits only
}

interface PhoneNumberInputProps {
  label?: string;
  value: PhoneNumberValue;
  onChange: (value: PhoneNumberValue) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Mobile number field: country-code picker + digit input, sharing one
// bordered row so it reads as a single control. Digits are capped to the
// selected country's expected national length and non-digit input is stripped.
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'Mobile number',
  disabled = false,
}) => {
  const selectedCountry = useMemo(
    () => COUNTRY_CODES.find(c => c.value === value.countryCode) ?? DEFAULT_COUNTRY_CODE,
    [value.countryCode],
  );

  const handleCountryChange = (item: CountryCode) => {
    onChange({ countryCode: item.value, number: value.number.slice(0, item.maxLength) });
  };

  const handleNumberChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, selectedCountry.maxLength);
    onChange({ countryCode: selectedCountry.value, number: digitsOnly });
  };

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="secondary" size={FONT_SIZES.sm} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.row,
          !!error && styles.rowError,
          disabled && styles.rowDisabled,
        ]}
      >
        <Dropdown
          style={styles.codePicker}
          containerStyle={styles.codeList}
          selectedTextStyle={styles.codeText}
          itemTextStyle={styles.codeText}
          activeColor={COLORS.primaryLight}
          data={COUNTRY_CODES}
          labelField="value"
          valueField="value"
          value={selectedCountry.value}
          disable={disabled}
          onChange={item => handleCountryChange(item as CountryCode)}
          renderItem={item => (
            <View style={styles.codeListItem}>
              <AppText size={FONT_SIZES.base}>{item.label}</AppText>
            </View>
          )}
        />

        <View style={styles.divider} />

        <TextInput
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={selectedCountry.maxLength}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          style={styles.input}
          value={value.number}
          onChangeText={handleNumberChange}
        />
      </View>

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    minHeight: 48,
    paddingRight: SPACING.md,
  },
  rowError: {
    borderColor: COLORS.status.error,
  },
  rowDisabled: {
    backgroundColor: COLORS.disabled,
  },
  codePicker: {
    width: 96,
    paddingLeft: SPACING.md,
  },
  codeList: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 160,
  },
  codeListItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  codeText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  helper: {
    marginTop: SPACING.xs,
  },
});

export default PhoneNumberInput;
