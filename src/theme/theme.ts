import { useColorScheme, TextStyle } from 'react-native';
import { useApp } from '../context/AppContext';

export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  danger: string;
  track: string;
  overlay: string;
}

// Emerald, deep teal, cream and gold.
const light: Palette = {
  bg: '#F6F1E4',
  surface: '#FFFDF7',
  surfaceAlt: '#EEE6D2',
  text: '#13302A',
  textMuted: '#5D6F68',
  border: '#E2D8C0',
  primary: '#0E6B53',
  primarySoft: '#D7EAE2',
  onPrimary: '#FFFFFF',
  accent: '#B07D1F',
  accentSoft: '#F3E4BE',
  danger: '#B3261E',
  track: '#E4DBC6',
  overlay: 'rgba(8, 24, 20, 0.55)',
};

const dark: Palette = {
  bg: '#08171A',
  surface: '#0F2428',
  surfaceAlt: '#163237',
  text: '#F2ECDB',
  textMuted: '#9DB3AD',
  border: '#1F3D41',
  primary: '#2FA885',
  primarySoft: '#123B35',
  onPrimary: '#04140F',
  accent: '#D9B45A',
  accentSoft: '#3A3221',
  danger: '#F2B8B5',
  track: '#1B3539',
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const ARABIC_FONT = 'Amiri_400Regular';
export const ARABIC_FONT_BOLD = 'Amiri_700Bold';

export const useTheme = () => {
  const { state } = useApp();
  const system = useColorScheme();
  const mode = state.settings.theme;
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const c = isDark ? dark : light;
  const scale = state.settings.arabicScale;
  // Amiri needs extra line height for its diacritics.
  const arabic = (size: number, bold = false): TextStyle => ({
    fontFamily: bold ? ARABIC_FONT_BOLD : ARABIC_FONT,
    fontSize: size * scale,
    lineHeight: size * scale * 1.75,
    color: c.text,
    textAlign: 'center',
    writingDirection: 'rtl',
  });
  return { c, isDark, arabic };
};

export type ThemeHook = ReturnType<typeof useTheme>;
