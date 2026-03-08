import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 280;
const STROKE = 4;
const RADIUS = (SIZE / 2) - (STROKE * 2);
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CounterRing = ({ count, target, onPress, dhikrName }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(CIRCUMFERENCE)).current;

  // Start continuous rotation on mount
  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    
    return () => rotation.stop();
  }, [rotateAnim]);

  // Update progress arc when count changes
  useEffect(() => {
    if (!target || target === 0) {
      Animated.timing(progressAnim, {
        toValue: CIRCUMFERENCE,
        duration: 400,
        useNativeDriver: false,
      }).start();
      return;
    }
    
    const offset = CIRCUMFERENCE - (count / target) * CIRCUMFERENCE;
    Animated.timing(progressAnim, {
      toValue: offset,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [count, target, progressAnim]);

  // Milestone flash effect when goal is reached
  useEffect(() => {
    if (target && count === target) {
      // Flash animation
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Bigger pulse on completion
      Animated.sequence([
        Animated.spring(pulseAnim, {
          toValue: 1.15,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count, target, glowAnim, pulseAnim]);

  // Pulse animation triggered on press
  const pulseAnimation = () => {
    // Scale animation
    Animated.sequence([
      Animated.spring(pulseAnim, {
        toValue: 1.08,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1.0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    pulseAnimation();
    if (onPress) {
      onPress();
    }
  };

  // Interpolate rotation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate percentage
  const percentage = target ? Math.round((count / target) * 100) : 0;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.wrapper}>
        {/* SVG Progress Arc - sits behind rings */}
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
          {/* Background track circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#2E1F00"
            strokeWidth={STROKE}
            fill="none"
            opacity={0.4}
          />

          {/* Animated gold progress arc */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#C9A84C"
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={progressAnim}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Rotating outer ring using SVG for better Android support */}
        <Animated.View
          style={[
            styles.outerRingContainer,
            {
              opacity: glowAnim,
              transform: [{ rotate }],
            },
          ]}
        >
          <Svg width={260} height={260} style={StyleSheet.absoluteFill}>
            <Circle
              cx={130}
              cy={130}
              r={129}
              stroke="#C9A84C"
              strokeWidth={1}
              fill="none"
              strokeDasharray="8,8"
              opacity={0.6}
            />
          </Svg>
        </Animated.View>

        {/* Middle Ring - Solid, Pulsing (not nested, so doesn't rotate) */}
        <Animated.View
          style={[
            styles.middleRing,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Inner Ring - Subtle, Static */}
          <View style={styles.innerRing}>
            {/* Count Number */}
            <Text style={styles.count}>
              {count}
            </Text>

            {/* Target Display */}
            {target && (
              <Text style={styles.target}>/ {target}</Text>
            )}

            {/* Dhikr Name Label */}
            {dhikrName && (
              <Text 
                style={styles.dhikrName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {dhikrName}
              </Text>
            )}

            {/* Percentage Label */}
            {target && (
              <Text style={styles.percent}>{percentage}%</Text>
            )}
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRingContainer: {
    width: 260,
    height: 260,
    position: 'absolute',
  },
  middleRing: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  innerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  count: {
    fontSize: 64,
    color: '#E8C96A',
    fontWeight: 'bold',
  },
  target: {
    fontSize: 18,
    color: 'rgba(240, 237, 228, 0.5)',
    fontWeight: '600',
    marginTop: -8,
  },
  dhikrName: {
    fontSize: 12,
    color: 'rgba(240, 237, 228, 0.5)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 180,
    lineHeight: 16,
  },
  percent: {
    fontSize: 11,
    color: 'rgba(201, 168, 76, 0.5)',
    letterSpacing: 2,
    marginTop: 2,
  },
});

export default CounterRing;
