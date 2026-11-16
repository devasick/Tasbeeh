import * as Haptics from 'expo-haptics';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

let click: AudioPlayer | null = null;
let complete: AudioPlayer | null = null;

const play = (kind: 'click' | 'complete', volume: number) => {
  try {
    if (kind === 'click') click = click || createAudioPlayer(require('../../assets/sounds/click.wav'));
    else complete = complete || createAudioPlayer(require('../../assets/sounds/complete.wav'));
    const player = kind === 'click' ? click! : complete!;
    player.volume = volume;
    player.seekTo(0).catch(() => {});
    player.play();
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
};

// Fire-and-forget: counting must never wait on feedback.
export const tapFeedback = (vibration: boolean, sound: boolean, volume: number) => {
  if (vibration) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  if (sound) play('click', volume);
};

export const completeFeedback = (vibration: boolean, sound: boolean, volume: number) => {
  if (vibration) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  if (sound) play('complete', volume);
};

export const lightHaptic = () => Haptics.selectionAsync().catch(() => {});
