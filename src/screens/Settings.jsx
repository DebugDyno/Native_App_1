import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, Check } from 'lucide-react-native';

const Settings = () => {
  const { theme, mode, setAppTheme } = useTheme();
  const [selectedMode, setSelectedMode] = useState(mode);
  const [modalVisible, setModalVisible] = useState(false);

  const themeOptions = [
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
    { key: 'system', label: 'System' },
  ];

  const handleThemeSelect = async selected => {
    setSelectedMode(selected);
    setModalVisible(false);
    await setAppTheme(selected);
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingRow}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.settingLabel}>App Theme</Text>
        <View style={styles.selector}>
          <Text style={styles.selectorText}>
            {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
          </Text>
          <ChevronDown size={18} color={theme.textLight} />
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <View style={styles.handleBar} />
          <Text style={styles.modalTitle}>Choose Theme</Text>

          {themeOptions.map(item => {
            const isSelected = selectedMode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.optionRow,
                  isSelected && { backgroundColor: theme.card },
                ]}
                onPress={() => handleThemeSelect(item.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? theme.primary : theme.text },
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && <Check size={20} color={theme.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    settingRow: {
      backgroundColor: theme.card,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    selector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    selectorText: {
      fontSize: 15,
      color: theme.textLight,
    },
    modalOverlay: {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    bottomSheet: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 20,
      elevation: 10,
    },
    handleBar: {
      width: 40,
      height: 5,
      backgroundColor: theme.border,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 10,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    optionText: {
      fontSize: 16,
    },
  });
