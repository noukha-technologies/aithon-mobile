import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CartesianChart, Line, Bar } from 'victory-native';
import { COLORS } from '@config/colors.config';
import { FONT_SIZES } from '@config/typography.config';
import { SPACING } from '@config/spacing.config';
import AppText from './AppText';

export interface ChartDatum {
  x: string | number;
  y: number;
  [key: string]: unknown;
}

interface AppChartProps {
  title?: string;
  data: ChartDatum[];
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
  yLabel?: string;
}

// Thin wrapper around victory-native's CartesianChart, pinned to our
// color tokens, for the common "one series over x" case. For multi-series
// or custom interactions, use victory-native directly.
const AppChart: React.FC<AppChartProps> = ({
  title,
  data,
  type = 'line',
  color = COLORS.primary,
  height = 220,
  yLabel,
}) => {
  if (!data.length) {
    return (
      <View style={[styles.wrapper, { height }]}>
        {title ? <AppText bold style={styles.title}>{title}</AppText> : null}
        <View style={styles.emptyState}>
          <AppText variant="secondary">No data to display</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {title ? <AppText bold style={styles.title}>{title}</AppText> : null}
      <View style={{ height }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['y']}
          axisOptions={{
            labelColor: COLORS.text.secondary,
            lineColor: COLORS.border,
            formatYLabel: v => (yLabel ? `${v}${yLabel}` : `${v}`),
          }}
        >
          {({ points, chartBounds }) =>
            type === 'line' ? (
              <Line points={points.y} color={color} strokeWidth={2} curveType="natural" />
            ) : (
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                color={color}
                roundedCorners={{ topLeft: 4, topRight: 4 }}
              />
            )
          }
        </CartesianChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  title: {
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppChart;
