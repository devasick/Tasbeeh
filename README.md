# Tasbeeh Counter App

A beautiful and feature-rich Tasbeeh (Dhikr) counter application built with React Native and Expo.

## Features

- **Tasbeeh counter**: ring or digital style, haptics, optional sound, undo, reset with confirmation, targets (33, 99, 100, 1000, custom or none), celebration at the target, optional keep-screen-on
- **Dhikr collection**: 12 authentic dhikr with Arabic, transliteration, meaning and hadith reference, each with its own counter; add your own dhikr
- **Daily goals and statistics**: daily goal, streaks, consistency, weekly/monthly/yearly charts, most recited dhikr, full session history with delete
- **Prayer times**: offline calculation (adhan) from device location or a chosen city, 12 calculation methods, Standard/Hanafi Asr, optional alerts before each prayer
- **Qibla compass**: live heading with calibration hints and clear permission/sensor errors
- **Reminders**: local notifications on chosen days and times with your own message
- **Personalization**: light/dark/system theme, Arabic font size (Amiri), English, Bahasa Indonesia and Türkçe
- Works offline, no ads, data stays on the device (AsyncStorage; data from older versions is migrated automatically)

## Development

- `npm test` runs the unit tests for state, migration, statistics and prayer/Qibla maths
- `npm run typecheck` runs TypeScript
- The `android/` folder is committed. Do not run `expo prebuild --clean`: it would regenerate it and could change the package name. After adding native modules, rebuild with `npm run android`.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - **iOS**: `npm run ios`
   - **Android**: `npm run android`
   - **Web**: `npm run web`

## Project Structure

```
Tasbeeh/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── context/          # State management
│   ├── utils/            # Utilities and helpers
│   ├── types/            # TypeScript type definitions
│   └── theme/            # Theme and styling
├── assets/               # Images and sounds
└── App.tsx              # Application entry point
```

## Usage

1. **Create a Counter**: Tap the + button to add a new counter
2. **Set a Goal**: Configure your target count in counter settings
3. **Start Counting**: Tap anywhere on the main screen to increment
4. **View Statistics**: Check your progress in the History tab
5. **Customize**: Adjust settings for haptics, sounds, and themes

## Technologies

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Haptics
- Expo AV (Audio)

## License

MIT License
# Tasbeeh
