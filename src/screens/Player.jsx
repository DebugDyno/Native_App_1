import { View, Text } from 'react-native';
import React from 'react';
import Video from 'react-native-video';
const Player = () => {
  return (
    <View>
      <Video
        source={{
          uri: 'https://content.jwplatform.com/manifests/yp34SRmf.m3u8',
        }}
        controls={true}
        resizeMode="contain"
        style={{ width: '100%', aspectRatio: 16 / 9 }}
      />
    </View>
  );
};
export default Player;
