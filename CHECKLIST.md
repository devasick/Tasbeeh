# Installation & Testing Checklist

## 📋 Pre-Installation Checklist

- [ ] Node.js installed (v16+)
- [ ] npm or yarn available
- [ ] iOS Simulator (Mac) or Android Emulator OR Expo Go app installed
- [ ] Good internet connection for downloading dependencies

## 🚀 Installation Steps

### Step 1: Navigate to Project
```bash
cd /Users/zaheen/Public/mobile-app/Tasbeeh
```
- [ ] Confirmed in Tasbeeh directory

### Step 2: Install Dependencies
Choose one method:

**Option A: Automatic Setup**
```bash
./setup.sh
```
- [ ] Script executed successfully
- [ ] All dependencies installed

**Option B: Manual Setup**
```bash
npm install
```
- [ ] npm install completed without errors
- [ ] node_modules directory created
- [ ] No peer dependency warnings

### Step 3: Start Development Server
```bash
npm start
```
- [ ] Metro bundler started
- [ ] QR code displayed in terminal
- [ ] No compilation errors

### Step 4: Run on Device/Simulator
Choose your platform:

**iOS (Mac only):**
- [ ] Press `i` in terminal
- [ ] iOS Simulator opens
- [ ] App loads successfully

**Android:**
- [ ] Press `a` in terminal
- [ ] Android Emulator opens
- [ ] App loads successfully

**Physical Device:**
- [ ] Expo Go app installed
- [ ] QR code scanned
- [ ] App loads on phone

## ✅ Feature Testing Checklist

### Main Counter Screen
- [ ] Counter screen loads
- [ ] Large counter display visible
- [ ] Counter increments on tap
- [ ] Haptic feedback works (physical device only)
- [ ] Sound plays on increment (if enabled)
- [ ] Progress bar shows (when goal is set)
- [ ] Reset button works
- [ ] Counter resets to 0

### Goal Completion
- [ ] Create counter with goal (e.g., 33)
- [ ] Increment to goal
- [ ] Celebration animation shows
- [ ] Success haptic feedback (physical device)
- [ ] Goal sound plays (if enabled)
- [ ] Entry added to history
- [ ] Auto-reset works (if enabled in settings)

### Counters Management
- [ ] Can navigate to Counters tab
- [ ] Can tap "+ Add Counter"
- [ ] Modal opens
- [ ] Can enter counter name
- [ ] Can select color
- [ ] Can select preset goal (33, 99, 100, 500, 1000)
- [ ] Can select "None" for no goal
- [ ] Can select "Custom" and enter custom goal
- [ ] Can create counter
- [ ] New counter appears in list
- [ ] Can tap counter to select it
- [ ] Selected counter shows in Counter screen
- [ ] Can edit counter
- [ ] Can delete counter
- [ ] Deletion confirmation shows

### History & Statistics
- [ ] Navigate to History tab
- [ ] Statistics cards display
- [ ] Total counts shows correct value
- [ ] Today's counts tracked
- [ ] Week/Month counts calculated
- [ ] Goals completed count accurate
- [ ] Streak counter works
- [ ] Most used counter shown (when applicable)
- [ ] History list shows completed sessions
- [ ] History items show date/time
- [ ] Goal badge shows for completed goals

### Settings
- [ ] Navigate to Settings tab
- [ ] Vibration toggle works
- [ ] Sound toggle works
- [ ] Volume control works (5 levels)
- [ ] Theme selector shows (Auto/Dark/Light)
- [ ] Can switch to Dark mode
- [ ] App switches to dark theme
- [ ] Can switch to Light mode
- [ ] App switches to light theme
- [ ] Auto mode follows system theme
- [ ] Auto-reset toggle works
- [ ] Settings persist after app restart

### Data Persistence
- [ ] Close app completely
- [ ] Reopen app
- [ ] Counters still present
- [ ] Counter values preserved
- [ ] History still available
- [ ] Settings retained

### Responsive Design
- [ ] Rotate to landscape
- [ ] UI adjusts properly
- [ ] Rotate to portrait
- [ ] UI returns to normal
- [ ] All screens work in both orientations

### Edge Cases
- [ ] Create counter with very long name (truncates properly)
- [ ] Increment counter to very large number (1000+)
- [ ] Create many counters (10+)
- [ ] Delete all counters
- [ ] App shows empty state
- [ ] Create first counter again
- [ ] Works properly

### Performance
- [ ] App launches quickly
- [ ] Counter increments are instant
- [ ] No lag when switching tabs
- [ ] Smooth animations
- [ ] No crashes during normal use

## 🐛 Known Issues to Check

- [ ] Sound files work (or gracefully fail if missing)
- [ ] Haptics work on physical device (not simulator)
- [ ] AsyncStorage permissions granted
- [ ] No console errors
- [ ] No memory leaks during extended use

## 📦 Build Testing (Optional)

### Development Build
- [ ] `npx expo start` works
- [ ] Can access on local network

### Production Build (Advanced)
- [ ] Expo account set up
- [ ] `eas build --platform ios` works (Mac)
- [ ] `eas build --platform android` works
- [ ] APK/IPA installs on device
- [ ] Production build runs correctly

## 📊 Code Quality Checks

- [ ] No TypeScript errors
- [ ] All imports resolve
- [ ] No unused variables/imports
- [ ] Proper error handling present
- [ ] Comments where needed

## 📝 Documentation Review

- [ ] README.md is clear and accurate
- [ ] GUIDE.md provides helpful instructions
- [ ] PROJECT_SUMMARY.md is comprehensive
- [ ] VISUAL_GUIDE.md matches actual UI
- [ ] This checklist is complete

## 🎯 Final Verification

- [ ] All core features work
- [ ] UI is polished and responsive
- [ ] Performance is acceptable
- [ ] No critical bugs found
- [ ] Ready for use/distribution

## 🎉 Success Criteria

The app is considered ready when:
1. ✅ All installation steps complete without errors
2. ✅ At least 90% of feature tests pass
3. ✅ No critical bugs (crashes, data loss)
4. ✅ Performance is smooth and responsive
5. ✅ Data persists correctly

## 📧 If Issues Occur

### Common Solutions:
1. **Dependencies fail to install:**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`

2. **Metro bundler errors:**
   - Clear Metro cache: `npx expo start -c`
   - Restart development server

3. **TypeScript errors:**
   - Ensure TypeScript installed: `npm install -D typescript`
   - Check tsconfig.json is present

4. **App won't load:**
   - Check Expo Go version is latest
   - Verify devices on same network
   - Restart development server

5. **Sound/Haptic not working:**
   - Expected on simulators
   - Test on physical device
   - Check permissions

---

**Date Completed:** _________________

**Tested By:** _________________

**Platform(s):** [ ] iOS  [ ] Android  [ ] Both

**Status:** [ ] Pass  [ ] Fail  [ ] Partial

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
