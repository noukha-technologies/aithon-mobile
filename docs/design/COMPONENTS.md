# Reusable Components

All components live in `src/views/components/` and import via `@components/Name`. See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the tokens they're built on.

## AppText

Base text primitive. Always use this instead of raw `Text`.

```tsx
<AppText bold size={FONT_SIZES.lg}>Chats</AppText>
<AppText variant="secondary">Messages will appear here</AppText>
<AppText variant="error" size={FONT_SIZES.xs}>Required field</AppText>
```

`variant`: `primary | secondary | white | green | error`.

## AppButton

```tsx
<AppButton label="Continue" onPress={handleContinue} />
<AppButton label="Cancel" variant="outline" onPress={handleCancel} />
<AppButton label="Delete account" variant="danger" onPress={handleDelete} />
<AppButton label="Submitting..." loading onPress={() => {}} />
```

`variant`: `primary | secondary | outline | ghost | danger`. `size`: `sm | md | lg`. Pass `loading` to show a spinner and auto-disable; pass `disabled` independently for non-loading disabled states.

## AppInput

Base text field with label/error/helper slots.

```tsx
<AppInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

Accepts every standard `TextInputProps` plus `label`, `error`, `helperText`, `leftElement`, `rightElement`. Use `leftElement`/`rightElement` for icons (e.g. a show/hide password toggle) rather than absolutely positioning icons over the field.

## AppDropdown

```tsx
<AppDropdown
  label="Country"
  data={[{ label: 'India', value: 'IN' }, { label: 'USA', value: 'US' }]}
  value={country}
  onChange={item => setCountry(item.value)}
  error={errors.country}
/>
```

Wraps `react-native-element-dropdown`. Always pass `data` as `{ label, value }[]` — the component is pinned to those field names so every dropdown in the app matches visually. Pass `search` to enable in-list filtering for long lists.

## PhoneNumberInput

Mobile number field with a country-code picker merged into one bordered row.

```tsx
const [phone, setPhone] = useState<PhoneNumberValue>({ countryCode: '+91', number: '' });

<PhoneNumberInput
  label="Mobile number"
  value={phone}
  onChange={setPhone}
  error={errors.phone}
/>
```

- Digits are auto-stripped of non-numeric characters and capped to the selected country's expected length (see `src/config/countryCodes.config.ts`).
- `value` is always `{ countryCode, number }` — concatenate them yourself (`${value.countryCode}${value.number}`) when sending to an API.
- To support more countries, add entries to `COUNTRY_CODES` in `countryCodes.config.ts` — don't fork the component.

## AppDatePicker

```tsx
<AppDatePicker
  label="Date of birth"
  mode="date"
  value={dob}
  onChange={setDob}
  maximumDate={new Date()}
  error={errors.dob}
/>
```

`mode`: `date | time | datetime`. Tapping the field opens the native modal picker (`react-native-date-picker`); `value` stays `null` until the user confirms. Pass `formatValue` to override the default display string.

## AppChart

```tsx
<AppChart
  title="Weekly signups"
  type="line"
  data={[{ x: 'Mon', y: 12 }, { x: 'Tue', y: 18 }, { x: 'Wed', y: 9 }]}
/>
<AppChart title="Revenue" type="bar" data={revenueData} color={COLORS.status.info} />
```

Thin wrapper over `victory-native`'s `CartesianChart` for the common single-series case (`x`/`y` pairs, line or bar). For multi-series charts, custom tooltips, pie/polar charts, or gesture-driven interactions, use `victory-native` directly — don't bend this wrapper to fit every case.

Requires the New Architecture + Reanimated 4 + `react-native-skia@2.x` (already wired — see peer deps in `package.json`). `react-native-skia` must stay on the 2.x line; victory-native doesn't support 3.x yet.

## AppBottomSheet

```tsx
const sheetRef = useRef<AppBottomSheetRef>(null);

<AppBottomSheet ref={sheetRef} title="Filter results" snapPoints={['40%', '80%']}>
  <FilterForm />
</AppBottomSheet>

<AppButton label="Filters" onPress={() => sheetRef.current?.present()} />
```

Wraps `@gorhom/bottom-sheet`'s `BottomSheetModal`. Call `.present()` / `.dismiss()` on the ref — don't manage visibility with local state, the library owns that. `BottomSheetModalProvider` is already mounted once at the app root (`src/AppWrapper.tsx`); don't add another one per-screen.

If content inside the sheet scrolls, use `BottomSheetScrollView`/`BottomSheetFlatList` from `@gorhom/bottom-sheet` instead of the plain RN versions — regular scroll views break the sheet's drag gesture.

## Adding a new component

1. Does an existing component cover this with a new prop? Prefer that over a new file.
2. Build on `AppText`/`AppInput` where possible rather than raw `Text`/`TextInput`.
3. Style only with `@config` tokens (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)).
4. Form-like components: controlled (`value`/`onChange`), accept `error`, accept `disabled`.
5. Add a short usage example here.
