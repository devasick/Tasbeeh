import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/theme';

interface Bar {
  label: string;
  value: number;
  highlight?: boolean;
}

/** Minimal bar chart on react-native-svg: one bar per period, the latest highlighted. */
export const BarChart: React.FC<{ bars: Bar[]; goal?: number; goalLabel?: string; height?: number; summary: string }> = ({
  bars,
  goal,
  goalLabel,
  height = 170,
  summary,
}) => {
  const { c } = useTheme();
  const [width, setWidth] = useState(0);
  const max = Math.max(1, goal || 0, ...bars.map((b) => b.value));
  const plotH = height - 22;
  const slot = width / Math.max(1, bars.length);
  const barW = Math.max(3, Math.min(26, slot * 0.6));
  const labelEvery = bars.length > 12 ? Math.ceil(bars.length / 6) : 1;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} accessible accessibilityLabel={summary}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {goal ? (
            <Line
              x1={0}
              x2={width}
              y1={plotH - (goal / max) * plotH}
              y2={plotH - (goal / max) * plotH}
              stroke={c.accent}
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          ) : null}
          {bars.map((b, i) => {
            const h = b.value > 0 ? Math.max(3, (b.value / max) * plotH) : 2;
            const x = i * slot + (slot - barW) / 2;
            return (
              <React.Fragment key={i}>
                <Rect x={x} y={plotH - h} width={barW} height={h} rx={Math.min(6, barW / 2)} fill={b.highlight ? c.accent : b.value ? c.primary : c.track} />
                {i % labelEvery === 0 || b.highlight ? (
                  <SvgText x={x + barW / 2} y={height - 4} fontSize={10} fill={c.textMuted} textAnchor="middle">
                    {b.label}
                  </SvgText>
                ) : null}
              </React.Fragment>
            );
          })}
        </Svg>
      )}
      {goal && goalLabel ? <Text style={{ color: c.accent, fontSize: 11, alignSelf: 'flex-end' }}>- - {goalLabel}</Text> : null}
    </View>
  );
};
