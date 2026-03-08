import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/theme';
import { colors } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const theme = useTheme(settings);

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {content}
    </View>
  );

  const renderSettingRow = (
    label: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    description?: string
  ) => (
    <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.gold }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const renderVolumeControl = () => (
    <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          Sound Volume
        </Text>
        <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
          {Math.round(settings.soundVolume * 100)}%
        </Text>
      </View>
      <View style={styles.volumeButtons}>
        {[0, 0.25, 0.5, 0.75, 1].map((vol) => (
          <TouchableOpacity
            key={vol}
            style={[
              styles.volumeButton,
              {
                backgroundColor:
                  settings.soundVolume === vol ? colors.gold : colors.border,
              },
            ]}
            onPress={() => updateSettings({ soundVolume: vol })}
          >
            <Text
              style={[
                styles.volumeButtonText,
                {
                  color:
                    settings.soundVolume === vol ? colors.background : colors.textMuted,
                },
              ]}
            >
              {vol === 0 ? '🔇' : vol === 1 ? '🔊' : '🔉'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderThemeSelector = () => (
    <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
      <Text style={[styles.settingLabel, { color: colors.text }]}>
        Theme
      </Text>
      <View style={styles.themeButtons}>
        {(['auto', true, false] as const).map((mode) => {
          const label = mode === 'auto' ? 'Auto' : mode ? 'Dark' : 'Light';
          const isSelected = settings.darkMode === mode;
          return (
            <TouchableOpacity
              key={String(mode)}
              style={[
                styles.themeButton,
                {
                  backgroundColor: isSelected ? colors.gold : colors.border,
                },
              ]}
              onPress={() => updateSettings({ darkMode: mode })}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: isSelected ? colors.background : colors.textMuted,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {renderSection(
        'FEEDBACK',
        <>
          {renderSettingRow(
            'Vibration',
            settings.vibrationEnabled,
            (value) => updateSettings({ vibrationEnabled: value }),
            'Feel a vibration on each count'
          )}
          {renderSettingRow(
            'Sound',
            settings.soundEnabled,
            (value) => updateSettings({ soundEnabled: value }),
            'Play a sound on each count'
          )}
          {settings.soundEnabled && renderVolumeControl()}
        </>
      )}

      {renderSection('APPEARANCE', renderThemeSelector())}

      {renderSection(
        'COUNTER BEHAVIOR',
        renderSettingRow(
          'Auto-reset after goal',
          settings.autoResetAfterGoal,
          (value) => updateSettings({ autoResetAfterGoal: value }),
          'Automatically reset counter when goal is reached'
        )
      )}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Tasbeeh Counter 1.0.2
        </Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Made with ❤️ for the community
        </Text>
         <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Developed by  Ahamed
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  volumeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  volumeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeButtonText: {
    fontSize: 16,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
