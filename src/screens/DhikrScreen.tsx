import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useTheme, space } from '../theme/theme';
import { useT } from '../i18n';
import { getProgress } from '../state/model';
import { PREDEFINED_DHIKR } from '../data/dhikrData';
import { Dhikr } from '../types';
import { DhikrCard } from '../components/DhikrCard';
import { Button } from '../components/Button';
import { Screen, Segmented, Sheet, EmptyState, IconButton, styles as ui } from '../components/ui';

type Draft = { id: string | null; name: string; arabic: string; meaning: string; count: string };
const emptyDraft: Draft = { id: null, name: '', arabic: '', meaning: '', count: '33' };

export const DhikrScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c } = useTheme();
  const { t } = useT();
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [draft, setDraft] = useState<Draft | null>(null);

  const start = (d: Dhikr) => {
    dispatch({ type: 'select', id: d.id, now: Date.now() });
    navigation.navigate('Home');
  };

  const edit = (d: Dhikr) =>
    setDraft({ id: d.id, name: d.transliteration, arabic: d.arabicText, meaning: d.meaning, count: String(d.recommendedCount) });

  const save = () => {
    if (!draft) return;
    const name = draft.name.trim();
    const count = parseInt(draft.count, 10);
    if (!name) return Alert.alert(t('nameRequiredTitle'), t('nameRequiredBody'));
    if (!Number.isFinite(count) || count < 1 || count > 100000) return Alert.alert(t('invalidTargetTitle'), t('invalidTargetBody'));
    const id = draft.id || `c-${Date.now()}`;
    dispatch({
      type: 'saveDhikr',
      dhikr: {
        id,
        transliteration: name,
        arabicText: draft.arabic.trim(),
        meaning: draft.meaning.trim(),
        recommendedCount: count,
        hadithReference: '',
        hadithSource: '',
        custom: true,
      },
    });
    // A new dhikr starts with its recommended count as target; an edit keeps the chosen one.
    if (!draft.id) dispatch({ type: 'setTarget', id, target: count });
    setDraft(null);
    setTab('mine');
  };

  const remove = () => {
    if (!draft?.id) return;
    const id = draft.id;
    Alert.alert(t('deleteDhikrTitle'), t('deleteDhikrBody', { name: draft.name }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'deleteDhikr', id, now: Date.now() });
          setDraft(null);
        },
      },
    ]);
  };

  const list = tab === 'all' ? PREDEFINED_DHIKR : state.customDhikr;
  const field = (key: keyof Draft, label: string, props: Partial<React.ComponentProps<typeof TextInput>> = {}) => (
    <View>
      <Text style={[ui.label, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        value={draft ? (draft[key] as string) : ''}
        onChangeText={(v) => draft && setDraft({ ...draft, [key]: v })}
        placeholderTextColor={c.textMuted}
        accessibilityLabel={label}
        style={[ui.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
        {...props}
      />
    </View>
  );

  return (
    <Screen
      title={t('tabDhikr')}
      subtitle={t('dhikrSubtitle')}
      right={<IconButton icon="plus-circle" label={t('addDhikr')} onPress={() => setDraft(emptyDraft)} color={c.primary} size={30} />}
    >
      <View style={{ marginBottom: space.lg }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: t('collection') },
            { value: 'mine', label: t('myDhikr') },
          ]}
        />
      </View>

      {list.length === 0 ? (
        <EmptyState
          icon="hand-heart-outline"
          title={t('noCustomTitle')}
          text={t('noCustomBody')}
          action={<Button title={t('addDhikr')} icon="plus" onPress={() => setDraft(emptyDraft)} />}
        />
      ) : (
        list.map((d) => (
          <DhikrCard
            key={d.id}
            dhikr={d}
            progress={getProgress(state, d.id)}
            active={d.id === state.activeId}
            onPress={() => start(d)}
            onEdit={d.custom ? () => edit(d) : undefined}
          />
        ))
      )}

      <Sheet visible={!!draft} onClose={() => setDraft(null)} title={draft?.id ? t('editDhikr') : t('addDhikr')}>
        {field('name', t('fieldName'), { placeholder: 'SubhanAllah', maxLength: 80, autoFocus: !draft?.id })}
        {field('arabic', t('fieldArabic'), { placeholder: 'سُبْحَانَ اللهِ', maxLength: 200, textAlign: 'right' })}
        {field('meaning', t('fieldMeaning'), { placeholder: 'Glory be to Allah', maxLength: 200 })}
        {field('count', t('fieldCount'), {
          keyboardType: 'number-pad',
          maxLength: 6,
          onChangeText: (v) => draft && setDraft({ ...draft, count: v.replace(/[^0-9]/g, '') }),
        })}
        <Button title={t('save')} onPress={save} />
        {draft?.id && <Button title={t('delete')} variant="ghost" icon="trash-can-outline" onPress={remove} style={{ marginTop: space.sm }} />}
      </Sheet>
    </Screen>
  );
};
