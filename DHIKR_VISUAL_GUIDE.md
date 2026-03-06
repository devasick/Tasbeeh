# Dhikr Feature - Quick Visual Guide

## 📱 User Interface Structure

```
┌─────────────────────────────────────┐
│  📿 Authentic Dhikr                 │
│  Select a dhikr to start counting   │
│  with Hadith references             │
├─────────────────────────────────────┤
│ ╔═════════════════════════════════╗ │
│ ║   سُبْحَانَ اللهِ              ║ │
│ ║   SubhanAllah                   ║ │
│ ║   Glory be to Allah             ║ │
│ ║         [33x]                   ║ │
│ ║   ─────────────────────────     ║ │
│ ║   📖 Hadith Reference:          ║ │
│ ║   Whoever says SubhanAllah...   ║ │
│ ║   Sahih Muslim 597              ║ │
│ ║   Tap to start counting →       ║ │
│ ╚═════════════════════════════════╝ │
│                                     │
│ ╔═════════════════════════════════╗ │
│ ║   الْحَمْدُ لِلَّهِ            ║ │
│ ║   Alhamdulillah                 ║ │
│ ║   All praise is due to Allah    ║ │
│ ║         [33x]                   ║ │
│ ║   ─────────────────────────     ║ │
│ ║   📖 Hadith Reference:          ║ │
│ ║   To be recited 33 times...     ║ │
│ ║   Sahih Muslim 597              ║ │
│ ║   Tap to start counting →       ║ │
│ ╚═════════════════════════════════╝ │
│                                     │
│ [More Dhikr cards...]               │
└─────────────────────────────────────┘
```

## 🎯 Counter Screen (Dhikr Mode)

When a user taps on a Dhikr card:

```
┌─────────────────────────────────────┐
│     سُبْحَانَ اللهِ               │
│     SubhanAllah                     │
│     Glory be to Allah               │
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────┐             │
│         │             │             │
│         │     15      │             │
│         │    / 33     │             │
│         │  Tap to     │             │
│         │   count     │             │
│         │             │             │
│         └─────────────┘             │
│                                     │
├─────────────────────────────────────┤
│  Progress: ███████░░░░░  45%        │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 📖 Hadith Reference           │  │
│  │                               │  │
│  │ Whoever says SubhanAllah 33   │  │
│  │ times, Alhamdulillah 33       │  │
│  │ times, and Allahu Akbar 34    │  │
│  │ times after every prayer,     │  │
│  │ his sins will be forgiven...  │  │
│  │                               │  │
│  │ Sahih Muslim 597              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Reset Count              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🎉 Goal Completion

When the user reaches the recommended count:

```
┌─────────────────────────────────────┐
│  ╔═══════════════════════════════╗  │
│  ║                               ║  │
│  ║          🎉                   ║  │
│  ║                               ║  │
│  ║      Goal Reached!            ║  │
│  ║                               ║  │
│  ║   33 counts completed         ║  │
│  ║                               ║  │
│  ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```

## 🗂️ Tab Navigation

Bottom navigation bar includes:

```
┌─────────────────────────────────────┐
│  🤲      📿      📋      📊      ⚙️  │
│ Tasbeeh  Dhikr  Counters History Settings
└─────────────────────────────────────┘
```

## 🔄 User Flow Diagram

```
Start App
    │
    ├─→ Tap "Dhikr" tab
    │       │
    │       ├─→ View list of 12 predefined Dhikr
    │       │       │
    │       │       ├─→ Tap on a Dhikr card
    │       │       │       │
    │       │       │       ├─→ Counter screen opens
    │       │       │       │       │
    │       │       │       │       ├─→ See Dhikr details
    │       │       │       │       │   (Arabic, meaning, Hadith)
    │       │       │       │       │
    │       │       │       │       ├─→ Tap screen to count
    │       │       │       │       │   (increments counter)
    │       │       │       │       │
    │       │       │       │       ├─→ Progress bar updates
    │       │       │       │       │
    │       │       │       │       ├─→ Reach goal?
    │       │       │       │       │   Yes → 🎉 Celebration
    │       │       │       │       │   No → Continue counting
    │       │       │       │       │
    │       │       │       │       └─→ Tap "Reset" to start over
    │       │       │       │
    │       │       │       └─→ Go back to Dhikr list
    │       │       │
    │       │       └─→ Select different Dhikr
    │       │
    │       └─→ Go to other tabs
    │
    └─→ Use regular counter (Tasbeeh tab)
```

## 📦 Component Hierarchy

```
App.tsx
 └─ Tab.Navigator
     ├─ CounterScreen (🤲 Tasbeeh)
     │   └─ Can display Dhikr mode
     │
     ├─ DhikrListScreen (📿 Dhikr)
     │   └─ FlatList
     │       └─ DhikrCard (x12)
     │           ├─ Arabic text
     │           ├─ Transliteration
     │           ├─ Meaning
     │           ├─ Count badge
     │           ├─ Hadith reference
     │           └─ Tap indicator
     │
     ├─ CountersScreen (📋 My Counters)
     ├─ HistoryScreen (📊 History)
     └─ SettingsScreen (⚙️ Settings)
```

## 🎨 Styling Features

- **Theme Support**: Adapts to light/dark mode
- **Typography Hierarchy**:
  - Arabic: 32-36px, bold
  - Transliteration: 18-20px, semi-bold
  - Meaning: 14-16px, italic
  - Hadith: 12-13px, regular
- **Colors**: Uses theme primary, secondary, and text colors
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle elevation for cards
- **Animations**: Scale effect on tap, celebration overlay

## 📖 Dhikr Content Example

**Example Dhikr Entry:**
```typescript
{
  id: 'dhikr-1',
  arabicText: 'سُبْحَانَ اللهِ',
  transliteration: 'SubhanAllah',
  meaning: 'Glory be to Allah',
  recommendedCount: 33,
  hadithReference: 'Whoever says SubhanAllah 33 times...',
  hadithSource: 'Sahih Muslim 597'
}
```

---

## ✨ Key Features

1. **12 Authentic Dhikr** with verified Hadith sources
2. **Beautiful Arabic typography** with proper diacritics
3. **Educational content** - users learn meaning and source
4. **Progress tracking** with visual feedback
5. **Goal celebration** animation
6. **Theme-aware** design
7. **Clean navigation** between list and counter
8. **Separate state** from regular counters

