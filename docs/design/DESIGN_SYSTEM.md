# Design System

Source of truth for visual rules across the app. Token files live in `src/config/`:

- `colors.config.ts` — `COLORS`
- `typography.config.ts` — `FONT_SIZES`, `FONT_WEIGHTS`, `LINE_HEIGHTS`
- `spacing.config.ts` — `SPACING`, `RADIUS`
- `measurements.config.ts` — `ws`, `hs`, `ms`, `wp`, `hp` scaling helpers

**Rule: never hardcode a color, font size, or spacing value in a screen or component.** Import it from these files. If the value you need doesn't exist yet, add it to the token file — don't inline it.

## Colors

```ts
import { COLORS } from '@config/colors.config';
```

| Token | Use |
|---|---|
| `COLORS.primary` / `primaryDark` / `primaryLight` | Brand green — CTAs, active states, selected states |
| `COLORS.secondary` | Dark neutral — secondary buttons, headers |
| `COLORS.background` | Screen background |
| `COLORS.surface` | Card / sheet / input background (on top of `background`) |
| `COLORS.text.primary` / `secondary` / `disabled` / `white` | Body text by hierarchy |
| `COLORS.status.success` / `warning` / `error` / `info` | Status badges, toasts, validation |
| `COLORS.border` / `borderFocused` / `divider` | Strokes and separators |
| `COLORS.disabled` | Disabled control backgrounds |
| `COLORS.overlay` | Modal / sheet backdrops |
| `COLORS.placeholder` | Input placeholder text |

Don't invent new greens/reds for one-off screens — reuse `status.*`. If a screen needs a color that doesn't map to an existing token, add it to `colors.config.ts` with a semantic name (`status.pending`, not `orange500`).

## Typography

```ts
import { FONT_SIZES, FONT_WEIGHTS } from '@config/typography.config';
```

Prefer `AppText` over raw `Text` — it already wires color variants and size. When you do need raw sizes/weights (e.g. inside a custom component), pull from `FONT_SIZES` / `FONT_WEIGHTS`, never a literal number or string.

| Size token | px (base 360 width) | Use |
|---|---|---|
| `xs` | 11 | Captions, helper/error text |
| `sm` | 13 | Secondary labels |
| `base` | 14 | Default body text |
| `md` | 16 | Emphasized body, input text |
| `lg` | 18 | Section titles |
| `xl` | 20 | Screen titles |
| `xxl` | 24 | Large headers |
| `xxxl` | 32 | Hero / splash numbers |

Weights: `regular` (body), `medium` (labels, active tab), `semibold` (card titles), `bold` (headers).

## Spacing & Radius

```ts
import { SPACING, RADIUS } from '@config/spacing.config';
```

4px base scale: `xs(4) sm(8) md(12) lg(16) xl(24) xxl(32) xxxl(48)`.

- Default screen horizontal padding: `SPACING.lg` (16).
- Gap between stacked form fields: `SPACING.md` (12).
- Gap between unrelated sections: `SPACING.xl` (24).
- Card/button corner radius: `RADIUS.md` (8) for buttons/inputs, `RADIUS.lg` (12) for cards, `RADIUS.full` for pills/avatars.

Don't use `margin: 10` or `padding: 15` — round to the nearest token so spacing stays on-grid.

## Scaling

All sizes must be screen-scaled via `ws`/`hs`/`ms` (from `measurements.config.ts`) — the token files already do this, so if you're consuming `SPACING`/`FONT_SIZES`/`RADIUS` you get it for free. Only reach for `ws`/`hs` directly when sizing something token files don't cover (e.g. a custom icon size, an image aspect box).

## Components

Reusable components live in `src/views/components/`, import via `@components/Name`. See [COMPONENTS.md](./COMPONENTS.md) for the catalog and usage examples.

Rules for building new ones:

1. **Props over duplication.** If you're about to copy an existing component and tweak a color, add a variant prop instead.
2. **Token-only styling.** No inline hex colors, raw font sizes, or raw spacing numbers inside components — pull from `@config`.
3. **Controlled by default.** Form components (`AppInput`, `AppDropdown`, `PhoneNumberInput`, `AppDatePicker`) take `value`/`onChange`-style props; they don't own canonical state.
4. **Error state is a prop, not a side effect.** Every input-like component accepts `error?: string` and renders it the same way (red helper text below the field, `borderFocused`→error-red border swap).
5. **Platform differences stay inside the component.** Screens should never branch on `Platform.OS` to work around a component's quirks — fix it in the component.

## Accessibility & touch targets

- Minimum touch target: 44x44 (use `SPACING` to pad small icons up to this, don't shrink below it).
- Every interactive element needs `accessibilityRole` and, where the label isn't visible text, `accessibilityLabel`.
- Don't rely on color alone for state (e.g. error) — pair with an icon or text, since `status.error` vs `status.success` can both read as "a red/green dot" to colorblind users.

## Do / Don't

| Do | Don't |
|---|---|
| `color: COLORS.text.secondary` | `color: '#666666'` |
| `padding: SPACING.lg` | `padding: 16` |
| `<AppText size={FONT_SIZES.lg} bold>` | `<Text style={{ fontSize: 18, fontWeight: '700' }}>` |
| Add a `variant` prop for a new look | Fork the component into `AppButtonRed.tsx` |
| Scale via `ws`/`hs`/`ms` | Hardcode pixel values that only look right on one device |
