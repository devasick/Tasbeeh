import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/theme';
import { colors } from '../theme/colors';
import { CounterCard } from '../components/CounterCard';
import { Button } from '../components/Button';
import { Counter, PRESET_GOALS, DEFAULT_COLORS } from '../types';
import { useNavigation } from '@react-navigation/native';

export const CountersScreen: React.FC = () => {
  const { counters, currentCounter, setCurrentCounter, addCounter, updateCounter, deleteCounter, settings } = useApp();
  const theme = useTheme(settings);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  const openAddModal = () => {
    setEditingCounter(null);
    setName('');
    setSelectedGoal(null);
    setCustomGoal('');
    setSelectedColor(DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]);
    setModalVisible(true);
  };

  const openEditModal = (counter: Counter) => {
    setEditingCounter(counter);
    setName(counter.name);
    setSelectedGoal(counter.goal);
    setCustomGoal(counter.goal && !PRESET_GOALS.includes(counter.goal) ? counter.goal.toString() : '');
    setSelectedColor(counter.color);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a counter name');
      return;
    }

    const finalGoal = selectedGoal === -1 
      ? (customGoal ? parseInt(customGoal) : null)
      : selectedGoal;

    if (editingCounter) {
      // Update existing counter
      const updatedCounter: Counter = {
        ...editingCounter,
        name: name.trim(),
        goal: finalGoal,
        color: selectedColor,
        updatedAt: Date.now(),
      };
      updateCounter(updatedCounter);
    } else {
      // Create new counter
      const newCounter: Counter = {
        id: Date.now().toString(),
        name: name.trim(),
        currentCount: 0,
        goal: finalGoal,
        color: selectedColor,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addCounter(newCounter);
    }

    setModalVisible(false);
  };

  const handleDelete = (counter: Counter) => {
    Alert.alert(
      'Delete Counter',
      `Are you sure you want to delete "${counter.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCounter(counter.id),
        },
      ]
    );
  };

  const renderCounter = ({ item }: { item: Counter }) => {
    const isSelected = currentCounter?.id === item.id;
    
    return (
      <View>
        <CounterCard
          name={item.name}
          count={item.currentCount}
          goal={item.goal}
          color={item.color}
          onPress={() => {
            setCurrentCounter(item);
            navigation.navigate('Counter' as never);
          }}
          theme={theme}
        />
        {isSelected && (
          <View style={styles.counterActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.gold }]}
              onPress={() => openEditModal(item)}
            >
              <Text style={[styles.actionButtonText, { color: colors.background }]}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.danger }]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.actionButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={counters}
        renderItem={renderCounter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No counters yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Create your first counter below
            </Text>
          </View>
        }
      />

      <View style={styles.addButton}>
        <Button
          title="+ Add Counter"
          onPress={openAddModal}
          theme={theme}
          size="large"
        />
      </View>

      {/* Add/Edit Counter Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.goldLight }]}>
              {editingCounter ? 'Edit Counter' : 'New Counter'}
            </Text>

            {/* Name Input */}
            <Text style={[styles.label, { color: colors.text }]}>
              Counter Name
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., SubhanAllah, Alhamdulillah"
              placeholderTextColor={colors.textMuted}
            />

            {/* Color Selection */}
            <Text style={[styles.label, { color: colors.text }]}>
              Color
            </Text>
            <View style={styles.colorGrid}>
              {DEFAULT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            {/* Goal Selection */}
            <Text style={[styles.label, { color: colors.text }]}>
              Goal (Optional)
            </Text>
            <View style={styles.goalGrid}>
              <TouchableOpacity
                style={[
                  styles.goalOption,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedGoal === null && [styles.goalOptionSelected, { borderColor: colors.gold }],
                ]}
                onPress={() => setSelectedGoal(null)}
              >
                <Text style={[styles.goalText, { color: colors.text }]}>None</Text>
              </TouchableOpacity>
              {PRESET_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalOption,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    selectedGoal === goal && [styles.goalOptionSelected, { borderColor: colors.gold }],
                  ]}
                  onPress={() => {
                    setSelectedGoal(goal);
                    setCustomGoal('');
                  }}
                >
                  <Text style={[styles.goalText, { color: colors.text }]}>{goal}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.goalOption,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedGoal === -1 && [styles.goalOptionSelected, { borderColor: colors.gold }],
                ]}
                onPress={() => setSelectedGoal(-1)}
              >
                <Text style={[styles.goalText, { color: colors.text }]}>Custom</Text>
              </TouchableOpacity>
            </View>

            {selectedGoal === -1 && (
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={customGoal}
                onChangeText={setCustomGoal}
                placeholder="Enter custom goal"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            )}

            {/* Actions */}
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                theme={theme}
              />
              <View style={{ width: 12 }} />
              <Button
                title={editingCounter ? 'Update' : 'Create'}
                onPress={handleSave}
                theme={theme}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  counterActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    padding: 20,
    marginBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  goalOptionSelected: {
    borderWidth: 2,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
});
