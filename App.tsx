import React from 'react';
import { Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider, useApp } from './src/context/AppContext';
import { useTheme } from './src/theme/theme';
import { colors } from './src/theme/colors';
import { CounterScreen } from './src/screens/CounterScreen';
import { CountersScreen } from './src/screens/CountersScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DhikrListScreen } from './src/screens/DhikrListScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const { settings } = useApp();
  const theme = useTheme(settings);
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: (insets.bottom > 0 ? insets.bottom : 8) + 60,
          },
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
          },
          tabBarItemStyle: {
          paddingVertical: 4,
          },
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: colors.goldLight,
          },
          headerTintColor: colors.gold,
          headerShadowVisible: false,
        }}
      >
        <Tab.Screen
          name="Counter"
          component={CounterScreen}
          options={{
            title: 'Tasbeeh',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="🤲" color={color} size={size + 6} />
            ),
          }}
        />
        <Tab.Screen
          name="Dhikr"
          component={DhikrListScreen}
          options={{
            title: 'Dhikr',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="📿" color={color} size={size + 6} />
            ),
          }}
        />
        <Tab.Screen
          name="Counters"
          component={CountersScreen}
          options={{
            title: 'My Counters',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="📋" color={color} size={size + 6} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="📊" color={color} size={size + 6} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon="⚙️" color={color} size={size + 6} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const TabIcon: React.FC<{ icon: string; color: string; size: number }> = ({
  icon,
  color,
  size,
}) => {
  return <Text style={{ fontSize: size, color }}>{icon}</Text>;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}