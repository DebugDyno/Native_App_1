import React from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme as useThemeContext } from '../context/ThemeContext'; // your context
import { ArrowRight, Diamond, Layers, Image, User,File } from 'lucide-react-native';

const Home = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const sections = [
    {
      title: 'Account',
      data: [
        { name: 'Profile', icon: User, screen: 'Profile' },
        { name: 'Settings', icon: Layers, screen: 'Settings' },
      ],
    },
    {
      title: 'Media',
      data: [
        { name: 'Upload Image', icon: Image, screen: 'UploadImage' },
        { name: 'Upload Files', icon: File, screen: 'UploadFiles' },
      ],
    },
    {
      title: 'Other',
      data: [{ name: 'Animations', icon: Diamond, screen: 'Animations' }],
    },
  ];

  const styles = getStyles(theme); // dynamic styles

  const renderItem = ({ item }) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(item.screen)}
      >
        <View style={styles.row}>
          <View style={styles.iconLabelRow}>
            <IconComponent size={22} color={theme.text} />
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
          <ArrowRight size={20} color={theme.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
};

export default Home;

// Function to generate styles dynamically
const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginVertical: 4,
      shadowColor: theme.shadow,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 10,
    },
    divider: {
      height: 8,
    },
  });
