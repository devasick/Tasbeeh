import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { DhikrCard } from '../components/DhikrCard';
import { PREDEFINED_DHIKR } from '../data/dhikrData';
import { Dhikr } from '../types';
import { useTheme } from '../theme/theme';
import { useApp } from '../context/AppContext';

type RootStackParamList = {
  Counter: { selectedDhikr?: Dhikr };
  Dhikr: undefined;
  Counters: undefined;
  History: undefined;
  Settings: undefined;
};

export const DhikrListScreen: React.FC = () => {
  const { settings } = useApp();
  const theme = useTheme(settings);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleDhikrPress = (dhikr: Dhikr) => {
    // Navigate to Counter screen with the selected Dhikr
    navigation.navigate('Counter', { selectedDhikr: dhikr });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>
        📿 Authentic Dhikr
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
        Select a dhikr to start counting with Hadith references
      </Text>
    </View>
  );

  const renderDhikrItem = ({ item }: { item: Dhikr }) => (
    <DhikrCard dhikr={item} onPress={handleDhikrPress} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={PREDEFINED_DHIKR}
        renderItem={renderDhikrItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
