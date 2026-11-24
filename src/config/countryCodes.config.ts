export interface CountryCode {
  label: string;   // "IN +91"
  value: string;   // "+91"
  iso: string;      // "IN"
  maxLength: number; // expected national number length
}

// Small curated list — extend as the app needs more markets.
export const COUNTRY_CODES: CountryCode[] = [
  { label: '🇮🇳 IN +91', value: '+91', iso: 'IN', maxLength: 10 },
  { label: '🇺🇸 US +1', value: '+1', iso: 'US', maxLength: 10 },
  { label: '🇬🇧 UK +44', value: '+44', iso: 'GB', maxLength: 10 },
  { label: '🇦🇪 UAE +971', value: '+971', iso: 'AE', maxLength: 9 },
  { label: '🇸🇬 SG +65', value: '+65', iso: 'SG', maxLength: 8 },
  { label: '🇦🇺 AU +61', value: '+61', iso: 'AU', maxLength: 9 },
];

export const DEFAULT_COUNTRY_CODE = COUNTRY_CODES[0];
