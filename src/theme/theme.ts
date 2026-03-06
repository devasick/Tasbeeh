import { useColorScheme } from 'react-native';
import { AppSettings } from '../types';

export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  warning: string;
  shadow: string;
}

const lightTheme: Theme = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#E1E8ED',
  primary: '#2ECC71',
  success: '#27AE60',
  danger: '#E74C3C',
  warning: '#F39C12',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: Theme = {
  background: '#1A1A1A',
  card: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#3A3A3A',
  primary: '#2ECC71',
  success: '#27AE60',
  danger: '#E74C3C',
  warning: '#F39C12',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const useTheme = (settings: AppSettings): Theme => {
  const systemColorScheme = useColorScheme();
  
  let isDark = false;
  if (settings.darkMode === 'auto') {
    isDark = systemColorScheme === 'dark';
  } else {
    isDark = settings.darkMode === true;
  }

  return isDark ? darkTheme : lightTheme;
};

export const commonStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
