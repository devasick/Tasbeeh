# Tasbeeh Counter - Quick Reference

## 🚀 Getting Started (3 Steps)

```bash
1. cd /Users/zaheen/Public/mobile-app/Tasbeeh
2. npm install
3. npm start
```

Then press `i` (iOS) or `a` (Android) or scan QR with Expo Go

---

## 📱 Main Features

| Feature | Description | Screen |
|---------|-------------|--------|
| **Count** | Tap anywhere to increment | Counter |
| **Reset** | Reset counter to 0 | Counter |
| **Add Counter** | Create new counter | Counters |
| **Set Goal** | Choose 33, 99, 100, 500, 1000, or custom | Counters |
| **View Stats** | See all-time, daily, weekly, monthly stats | History |
| **Toggle Haptic** | Turn vibration on/off | Settings |
| **Toggle Sound** | Turn sound on/off | Settings |
| **Change Theme** | Switch between light/dark/auto | Settings |

---

## ⌨️ Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm start` | Start dev server |
| `npx expo start -c` | Start with cache cleared |
| `npm run ios` | Run on iOS (Mac only) |
| `npm run android` | Run on Android |

---

## 🗂️ File Structure

```
Tasbeeh/
├── App.tsx                    # Main entry point
├── src/
│   ├── screens/               # 4 main screens
│   ├── components/            # Reusable UI components
│   ├── context/               # State management
│   ├── utils/                 # Helpers & utilities
│   ├── theme/                 # Theming system
│   └── types/                 # TypeScript types
└── assets/                    # Images & sounds
```

---

## 🎨 Customization Quick Tips

### Add Custom Color
Edit `src/types/index.ts`:
```typescript
export const DEFAULT_COLORS = [
  '#2ECC71',  // Green
  '#YOUR_COLOR_HERE',
];
```

### Add Preset Goal
Edit `src/types/index.ts`:
```typescript
export const PRESET_GOALS = [33, 99, 100, 500, 1000, YOUR_NUMBER];
```

### Change Default Settings
Edit `src/utils/storage.ts`:
```typescript
export const DEFAULT_SETTINGS: AppSettings = {
  vibrationEnabled: true,  // Change to false
  soundEnabled: true,      // Change to false
  // ...
};
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Dependencies fail | `rm -rf node_modules && npm install` |
| Metro errors | `npx expo start -c` |
| App won't load | Check same WiFi network |
| Sounds not working | Add .mp3 files to /assets |
| Haptic not working | Test on physical device |

---

## 📊 Data Storage Locations

| Data | Storage Key | Type |
|------|-------------|------|
| Counters | `@tasbeeh_counters` | Array of Counter objects |
| History | `@tasbeeh_history` | Array of CountHistory objects |
| Settings | `@tasbeeh_settings` | AppSettings object |

All stored in AsyncStorage (persists locally)

---

## 🔑 Key TypeScript Interfaces

```typescript
// Counter
interface Counter {
  id: string;
  name: string;
  currentCount: number;
  goal: number | null;
  color: string;
  createdAt: number;
  updatedAt: number;
}

// Settings
interface AppSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean | 'auto';
  autoResetAfterGoal: boolean;
  defaultGoal: number | null;
}
```

---

## 📈 Statistics Calculated

- **Total Counts**: Sum of all counter values
- **Today**: Counts from history in last 24h
- **This Week**: Last 7 days
- **This Month**: Last 30 days
- **Goals Completed**: History entries where count ≥ goal
- **Streak**: Consecutive days with activity
- **Most Used**: Counter with most history entries

---

## 🎯 Navigation Tabs

| Icon | Tab | Purpose |
|------|-----|---------|
| 🤲 | Counter | Main counting screen |
| 📋 | Counters | Manage counters |
| 📊 | History | View stats & history |
| ⚙️ | Settings | App configuration |

---

## ⚡ Performance Tips

1. Don't create 100+ counters (keep it reasonable)
2. History auto-limits to last 100 entries
3. Sounds should be < 1 second
4. Images should be optimized (< 500KB)

---

## 📝 Essential Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `GUIDE.md` | Comprehensive guide |
| `CHECKLIST.md` | Testing checklist |
| `PROJECT_SUMMARY.md` | Complete summary |
| `VISUAL_GUIDE.md` | UI mockups |
| **This file** | Quick reference |

---

## 🎓 Learning Resources

- **React Native**: reactnative.dev
- **Expo**: docs.expo.dev
- **React Navigation**: reactnavigation.org
- **TypeScript**: typescriptlang.org

---

## ✅ Project Status

**Version:** 1.0.0  
**Status:** ✅ Complete & Ready  
**Files Created:** 30+  
**Lines of Code:** ~2,500+  
**Features:** 100% Implemented  

---

## 🤲 Islamic Design Principles Used

- **Simplicity** - Clean, minimal interface
- **Functionality** - No distractions, focus on dhikr
- **Beauty** - Elegant typography and spacing
- **Accessibility** - Easy for all ages
- **Respect** - No ads, no tracking, privacy-first

---

**Quick Access:**
- Installation: `./setup.sh`
- Start: `npm start`
- Questions: Check GUIDE.md
- Testing: See CHECKLIST.md

**May Allah accept our dhikr! 🤲**
