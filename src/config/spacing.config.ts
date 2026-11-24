import { ws } from './measurements.config';

// 4px base spacing scale. Always compose layout spacing from these
// instead of ad-hoc numbers so density stays consistent across screens.
export const SPACING = {
  xs: ws(4),
  sm: ws(8),
  md: ws(12),
  lg: ws(16),
  xl: ws(24),
  xxl: ws(32),
  xxxl: ws(48),
};

export const RADIUS = {
  sm: ws(4),
  md: ws(8),
  lg: ws(12),
  xl: ws(16),
  full: 999,
};
