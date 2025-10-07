import { View, Text } from 'react-native';
import React from 'react';
import Video from 'react-native-video';
const Player = () => {
  return (
    <View>
      <Video
        source={{
          uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        }}
        controls={true}
        resizeMode="contain"
        style={{ width: '100%', aspectRatio: 16 / 9 }}
      />
    </View>
  );
};
export default Player;
