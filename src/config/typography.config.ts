import { ms } from './measurements.config';

// Scaled font sizes. Always pull sizes from here instead of hardcoding numbers
// so text scales consistently across device sizes.
export const FONT_SIZES = {
  xs: ms(11),
  sm: ms(13),
  base: ms(14),
  md: ms(16),
  lg: ms(18),
  xl: ms(20),
  xxl: ms(24),
  xxxl: ms(32),
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};
