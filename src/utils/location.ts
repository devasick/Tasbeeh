import * as Location from 'expo-location';
import { SavedLocation } from '../types';

export type LocationError = 'denied' | 'unavailable';

/** Asks for foreground location once, then returns the device position with a readable name when possible. */
export const getDeviceLocation = async (): Promise<SavedLocation> => {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (perm.status !== 'granted') throw new Error('denied' as LocationError);
  let pos: Location.LocationObject | null = null;
  try {
    pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  } catch {
    pos = await Location.getLastKnownPositionAsync();
  }
  if (!pos) throw new Error('unavailable' as LocationError);
  const { latitude: lat, longitude: lng } = pos.coords;
  let name = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    const label = place && (place.city || place.subregion || place.region);
    if (label) name = place.country ? `${label}, ${place.country}` : label;
  } catch {
    // Offline: keep coordinates as the name.
  }
  return { lat, lng, name, source: 'device' };
};
