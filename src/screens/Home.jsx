import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

import { Feather } from '@react-native-vector-icons/feather';
import {ArrowRight, House } from 'lucide-react-native';


const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'left', 'top']}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Details')}>
        <Text style={styles.link}>Go to Details</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('UploadImage')}>
        <Text style={styles.link}>Image Upload</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 20,
    color: 'red',
  },
  link: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 16,
  },
});
