import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

import { ArrowRight, House } from 'lucide-react-native';

import { Lucide } from '@react-native-vector-icons/lucide';

const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'left', 'top']}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16, // move margin from Text to container
          }}
        >
          <Text style={styles.link}>Go to Details</Text>
          <Lucide
            name="arrow-right"
            size={24}
            color={COLORS.text}
            style={{ marginLeft: 8 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('UploadImage')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <Text style={styles.link}>Image Upload</Text>
          <Lucide
            name="arrow-right"
            size={24}
            color={COLORS.text}
            style={{ marginLeft: 8 }}
          />
        </View>
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
    // marginTop: 16,
  },
});
