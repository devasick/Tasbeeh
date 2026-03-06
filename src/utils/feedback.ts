import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

let clickSound: Audio.Sound | null = null;
let goalSound: Audio.Sound | null = null;

// Initialize sounds
export const initSounds = async (): Promise<void> => {
  try {
    // For now, we'll use system sounds
    // In production, you would load custom sound files
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch (error) {
    console.error('Error initializing sounds:', error);
  }
};

// Play click sound
export const playClickSound = async (volume: number): Promise<void> => {
  // Sound files not included - add click.mp3 to assets folder to enable
  // Uncomment below when sound file is available:
  /*
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/click.mp3'),
      { volume, shouldPlay: true }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
  */
};

// Play goal completion sound
export const playGoalSound = async (volume: number): Promise<void> => {
  // Sound files not included - add goal.mp3 to assets folder to enable
  // Uncomment below when sound file is available:
  /*
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/goal.mp3'),
      { volume, shouldPlay: true }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing goal sound:', error);
  }
  */
};

// Trigger haptic feedback
export const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error) {
    console.error('Error triggering haptic:', error);
  }
};

// Trigger success haptic
export const triggerSuccessHaptic = async (): Promise<void> => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error('Error triggering success haptic:', error);
  }
};

// Cleanup
export const cleanupSounds = async (): Promise<void> => {
  try {
    if (clickSound) {
      await clickSound.unloadAsync();
    }
    if (goalSound) {
      await goalSound.unloadAsync();
    }
  } catch (error) {
    console.error('Error cleaning up sounds:', error);
  }
};
