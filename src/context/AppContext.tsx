import React, { createContext, useContext, useEffect, useReducer, useRef, useState, ReactNode } from 'react';
import { AppState as RNAppState } from 'react-native';
import { AppState } from '../types';
import { Action, initialState, reducer } from '../state/model';
import { loadState, saveState } from '../utils/storage';
import { syncPrayerNotifications, syncReminders } from '../utils/notifications';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  ready: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [ready, setReady] = useState(false);
  const latest = useRef(state);
  latest.current = state;

  useEffect(() => {
    loadState().then((loaded) => {
      dispatch({ type: 'hydrate', state: loaded });
      dispatch({ type: 'endIdleSession', now: Date.now() });
      setReady(true);
    });
  }, []);

  // Debounced save; also flushed when the app goes to the background.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => saveState(state), 400);
    return () => clearTimeout(timer);
  }, [state, ready]);

  useEffect(() => {
    if (!ready) return;
    const sub = RNAppState.addEventListener('change', (next) => {
      if (next === 'active') {
        dispatch({ type: 'endIdleSession', now: Date.now() });
        syncPrayerNotifications(latest.current.prayer, latest.current.settings.language);
      } else {
        saveState(latest.current);
      }
    });
    return () => sub.remove();
  }, [ready]);

  useEffect(() => {
    if (ready) syncReminders(state.reminders);
  }, [state.reminders, ready]);

  useEffect(() => {
    if (ready) syncPrayerNotifications(state.prayer, state.settings.language);
  }, [state.prayer, state.settings.language, ready]);

  return <AppContext.Provider value={{ state, dispatch, ready }}>{children}</AppContext.Provider>;
};
