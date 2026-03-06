# Tasbeeh Counter - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed with dependencies)
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your phone

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd Tasbeeh
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   - Press `i` for iOS Simulator (Mac only)
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 📱 Features Overview

### 1. Main Counter Screen
- **Tap anywhere** on the counter area to increment
- Large, easy-to-read counter display
- Real-time progress bar (when goal is set)
- Celebration animation when goal is reached
- Haptic and sound feedback (configurable)

### 2. Counters Management
- Create unlimited counters for different dhikr
- Customize each counter with:
  - Custom name
  - Color theme
  - Goal target (preset or custom)
- Edit or delete existing counters
- Switch between counters with a tap

### 3. History & Statistics
- View all completed sessions
- Track daily, weekly, and monthly progress
- See total counts across all counters
- Monitor your streak
- Identify most used counter

### 4. Settings
- **Feedback Controls:**
  - Toggle vibration on/off
  - Toggle sound on/off
  - Adjust sound volume
- **Appearance:**
  - Light mode
  - Dark mode
  - Auto (follows system)
- **Behavior:**
  - Auto-reset after goal completion

## 🎨 Customization

### Adding Custom Colors
Edit `/src/types/index.ts` and modify the `DEFAULT_COLORS` array:
```typescript
export const DEFAULT_COLORS = [
  '#2ECC71', // Green
  '#3498DB', // Blue
  // Add your colors here
];
```

### Adding Custom Goal Presets
Edit `/src/types/index.ts` and modify the `PRESET_GOALS` array:
```typescript
export const PRESET_GOALS = [33, 99, 100, 500, 1000];
```

### Adding Sound Files
1. Place your sound files in `/assets/`
2. Name them `click.mp3` (for count) and `goal.mp3` (for goal completion)
3. Sounds should be short (< 1 second) for best UX

## 🏗️ Project Structure

```
Tasbeeh/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CounterCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── StatCard.tsx
│   ├── context/          # State management
│   │   └── AppContext.tsx
│   ├── screens/          # Main app screens
│   │   ├── CounterScreen.tsx
│   │   ├── CountersScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── theme/            # Styling and theming
│   │   └── theme.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   └── utils/            # Helper functions
│       ├── feedback.ts
│       ├── helpers.ts
│       └── storage.ts
├── assets/               # Images and sounds
├── App.tsx              # Main app component
└── package.json         # Dependencies

```

## 🔧 Common Tasks

### Resetting All Data
To clear all stored data (counters, history, settings), you can:
1. Uninstall and reinstall the app, OR
2. Add a "Clear All Data" button in settings (developer option)

### Building for Production

**iOS:**
```bash
expo build:ios
```

**Android:**
```bash
expo build:android
```

**Both:**
```bash
eas build --platform all
```

(Note: You'll need an Expo account and may need to configure `eas.json`)

## 🐛 Troubleshooting

### Issue: Sounds not playing
- Ensure sound files exist in `/assets/` directory
- Check that sounds are in MP3 format
- Verify sound is enabled in Settings

### Issue: Haptic feedback not working
- Haptic feedback only works on physical devices
- Not available in simulators/emulators
- Check that vibration is enabled in Settings

### Issue: Data not persisting
- Clear app cache and restart
- Check AsyncStorage permissions
- Verify no errors in console

## 📊 Data Storage

All data is stored locally using AsyncStorage:
- **Counters**: Counter configurations and current counts
- **History**: Completed sessions with timestamps
- **Settings**: User preferences

Data persists across app restarts but is cleared if the app is uninstalled.

## 🎯 Usage Tips

1. **For Different Dhikr**: Create separate counters for SubhanAllah, Alhamdulillah, Allahu Akbar, etc.
2. **Set Daily Goals**: Use the goal feature to maintain consistency
3. **Check Statistics**: Review your progress regularly to stay motivated
4. **Customize Colors**: Use different colors to quickly identify counters
5. **Landscape Mode**: The app supports both portrait and landscape orientations

## 📝 License

MIT License - Feel free to modify and distribute

## 🤲 Credits

Built with love for the Muslim community.

May Allah accept our dhikr and make it a means of drawing closer to Him.

---

**Need Help?** Check the README.md or create an issue on GitHub.
