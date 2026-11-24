import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '@config/colors.config';
import { SPACING, RADIUS } from '@config/spacing.config';
import { FONT_SIZES } from '@config/typography.config';
import AppText from './AppText';

export type AppBottomSheetRef = React.ElementRef<typeof BottomSheetModal>;

interface AppBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
}

// Wraps @gorhom/bottom-sheet's modal variant so screens only deal with
// present()/dismiss() via ref, without touching snap-point or backdrop plumbing.
// Requires BottomSheetModalProvider at the app root (already set in AppWrapper).
const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  ({ title, children, snapPoints = ['50%'], onDismiss }, ref) => {
    const points = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={points}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.content}>
          {title ? (
            <AppText bold size={FONT_SIZES.lg} style={styles.title}>
              {title}
            </AppText>
          ) : null}
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

AppBottomSheet.displayName = 'AppBottomSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handleIndicator: {
    backgroundColor: COLORS.border,
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.md,
  },
});

export default AppBottomSheet;
