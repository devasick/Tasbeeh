import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/theme';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Dhikr } from '../types';

const { width } = Dimensions.get('window');

type CounterScreenRouteProp = RouteProp<{ Counter: { selectedDhikr?: Dhikr } }, 'Counter'>;

export const CounterScreen: React.FC = () => {
  const { currentCounter, incrementCounter, resetCounter, settings } = useApp();
  const theme = useTheme(settings);
  const route = useRoute<CounterScreenRouteProp>();
  const selectedDhikr = route.params?.selectedDhikr;
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Dhikr-specific state
  const [dhikrCount, setDhikrCount] = useState(0);
  const isDhikrMode = selectedDhikr !== undefined;

  // Animate counter increment
  const animateIncrement = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Check for goal completion
  useEffect(() => {
    const currentCount = isDhikrMode ? dhikrCount : currentCounter?.currentCount;
    const goal = isDhikrMode ? selectedDhikr?.recommendedCount : currentCounter?.goal;
    
    if (goal && currentCount === goal) {
      setShowCelebration(true);
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => setShowCelebration(false));
    }
  }, [isDhikrMode, dhikrCount, currentCounter?.currentCount, currentCounter?.goal, selectedDhikr?.recommendedCount]);

  const handleIncrement = () => {
    if (isDhikrMode) {
      setDhikrCount(prev => prev + 1);
    } else {
      incrementCounter();
    }
    animateIncrement();
  };

  const handleReset = () => {
    if (isDhikrMode) {
      setDhikrCount(0);
    } else {
      resetCounter();
    }
  };

  // Dhikr Mode Rendering
  if (isDhikrMode && selectedDhikr) {
    const progressPercentage = Math.min((dhikrCount / selectedDhikr.recommendedCount) * 100, 100);
    
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Dhikr Header */}
        <View style={styles.dhikrHeader}>
          <Text style={[styles.dhikrArabic, { color: theme.text }]}>
            {selectedDhikr.arabicText}
          </Text>
          <Text style={[styles.dhikrTransliteration, { color: theme.primary }]}>
            {selectedDhikr.transliteration}
          </Text>
          <Text style={[styles.dhikrMeaning, { color: theme.textSecondary }]}>
            {selectedDhikr.meaning}
          </Text>
        </View>

        {/* Main Counter Display */}
        <TouchableOpacity
          style={styles.counterArea}
          onPress={handleIncrement}
          activeOpacity={0.9}
        >
          <View style={styles.counterCircle}>
            <Animated.View
              style={[
                styles.countContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={[styles.count, { color: theme.primary }]}>
                {dhikrCount.toLocaleString()}
              </Text>
              <Text style={[styles.goalText, { color: theme.textSecondary }]}>
                / {selectedDhikr.recommendedCount}
              </Text>
              <Text style={[styles.tapHint, { color: theme.textSecondary }]}>
                Tap to count
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <ProgressBar
            current={dhikrCount}
            goal={selectedDhikr.recommendedCount}
            color={theme.primary}
            theme={theme}
          />
          <Text style={[styles.percentageText, { color: theme.textSecondary }]}>
            {progressPercentage.toFixed(0)}% Complete
          </Text>
        </View>

        {/* Hadith Reference Section */}
        <View style={[styles.hadithBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.hadithLabel, { color: theme.primary }]}>
            📖 Hadith Reference
          </Text>
          <Text style={[styles.hadithText, { color: theme.textSecondary }]}>
            {selectedDhikr.hadithReference}
          </Text>
          <Text style={[styles.hadithSource, { color: theme.primary }]}>
            {selectedDhikr.hadithSource}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Reset Count"
            onPress={handleReset}
            variant="outline"
            theme={theme}
            size="large"
          />
        </View>

        {/* Celebration Overlay */}
        {showCelebration && (
          <Animated.View
            style={[
              styles.celebration,
              {
                opacity: celebrationAnim,
                transform: [
                  {
                    scale: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[styles.celebrationText, { color: '#FFFFFF' }]}>
              Goal Reached!
            </Text>
            <Text style={[styles.celebrationSubtext, { color: '#FFFFFF' }]}>
              {dhikrCount} counts completed
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    );
  }

  // Regular Counter Mode (existing code)
  if (!currentCounter) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No counter selected
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Create a counter in the Counters tab
          </Text>
        </View>
      </View>
    );
  }

  const progressPercentage = currentCounter.goal
    ? Math.min((currentCounter.currentCount / currentCounter.goal) * 100, 100)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.counterName, { color: theme.text }]}>
          {currentCounter.name}
        </Text>
        {currentCounter.goal && (
          <Text style={[styles.goalText, { color: theme.textSecondary }]}>
            Goal: {currentCounter.goal.toLocaleString()}
          </Text>
        )}
      </View>

      {/* Main Counter Display */}
      <TouchableOpacity
        style={styles.counterArea}
        onPress={handleIncrement}
        activeOpacity={0.9}
      >
        <View style={styles.counterCircle}>
          <Animated.View
            style={[
              styles.countContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={[styles.count, { color: currentCounter.color }]}>
              {currentCounter.currentCount.toLocaleString()}
            </Text>
            <Text style={[styles.tapHint, { color: theme.textSecondary }]}>
              Tap to count
            </Text>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      {currentCounter.goal && (
        <View style={styles.progressSection}>
          <ProgressBar
            current={currentCounter.currentCount}
            goal={currentCounter.goal}
            color={currentCounter.color}
            theme={theme}
          />
          <Text style={[styles.percentageText, { color: theme.textSecondary }]}>
            {progressPercentage.toFixed(0)}% Complete
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Reset"
          onPress={resetCounter}
          variant="outline"
          theme={theme}
          size="large"
        />
      </View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Animated.View
          style={[
            styles.celebration,
            {
              opacity: celebrationAnim,
              transform: [
                {
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={[styles.celebrationText, { color: theme.text }]}>
            Goal Reached!
          </Text>
          <Text style={[styles.celebrationSubtext, { color: theme.textSecondary }]}>
            {currentCounter.currentCount} counts completed
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dhikrHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  dhikrArabic: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 50,
  },
  dhikrTransliteration: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  dhikrMeaning: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hadithBox: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  hadithLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hadithText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  hadithSource: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  counterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
  },
  counterArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  counterCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    alignItems: 'center',
  },
  count: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
  progressSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  percentageText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
  actions: {
    marginBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
  celebration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  celebrationSubtext: {
    fontSize: 18,
  },
});
