import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { AppProvider, useApp } from './src/context/AppContext';
import { useTheme } from './src/theme/theme';
import { useT } from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { DhikrScreen } from './src/screens/DhikrScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { ToolsScreen } from './src/screens/ToolsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
const TABS: { name: string; component: React.FC; icon: IconName; label: 'tabHome' | 'tabDhikr' | 'tabStats' | 'tabTools' | 'tabSettings' }[] = [
  { name: 'Home', component: HomeScreen, icon: 'circle-double', label: 'tabHome' },
  { name: 'Dhikr', component: DhikrScreen, icon: 'book-open-page-variant-outline', label: 'tabDhikr' },
  { name: 'Statistics', component: StatisticsScreen, icon: 'chart-box-outline', label: 'tabStats' },
  { name: 'Tools', component: ToolsScreen, icon: 'compass-outline', label: 'tabTools' },
  { name: 'Settings', component: SettingsScreen, icon: 'cog-outline', label: 'tabSettings' },
];

const AppNavigator: React.FC = () => {
  const { state, ready } = useApp();
  const { c, isDark } = useTheme();
  const { t } = useT();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
        <ActivityIndicator color={c.primary} size="large" />
      </View>
    );
  }

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: c.bg,
      card: c.surface,
      text: c.text,
      border: c.border,
      primary: c.primary,
    },
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {!state.onboarded ? (
        <OnboardingScreen />
      ) : (
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            backBehavior="firstRoute"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: c.primary,
              tabBarInactiveTintColor: c.textMuted,
              tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border },
              tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
          >
            {TABS.map((tab) => (
              <Tab.Screen
                key={tab.name}
                name={tab.name}
                component={tab.component}
                options={{
                  title: t(tab.label),
                  tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={tab.icon} color={color} size={size} />,
                }}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default function App() {
  // Arabic falls back to the system font if the bundled one fails to load.
  const [fontsLoaded, fontError] = useFonts({ Amiri_400Regular, Amiri_700Bold });
  if (!fontsLoaded && !fontError) return null;
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
