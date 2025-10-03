import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { COLORS } from '../constants/colors';

// Upload function
const uploadImageToImgBB = async uri => {
  const base_url = `https://api.imgbb.com/1/upload?expiration=600&key=5eead99c84466452b0010c039a6a555c`;

  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append('image', { uri, name: filename, type });

  try {
    const response = await fetch(base_url, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const UploadImageScreen = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const pickImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0 }, // 0 = multiple
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else {
          const uris = response.assets.map(asset => asset.uri);
          setImages(uris);
          setUploadedUrls([]);
        }
      },
    );
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImages(prev => [...prev, uri]);
        setUploadedUrls([]);
      }
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      Alert.alert('No image', 'Please select at least one image first.');
      return;
    }

    try {
      setUploading(true);
      const urls = [];

      for (let uri of images) {
        const result = await uploadImageToImgBB(uri);
        if (result.success) {
          urls.push(result.data.url);
        } else {
          Alert.alert('Upload failed', 'One or more images failed to upload.');
        }
      }

      setUploadedUrls(urls);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images.');
    } finally {
      setUploading(false);
    }
  };

  const openLink = url => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Upload Images</Text> */}

      <View style={styles.previewContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.previewContent}
          showsHorizontalScrollIndicator={false}
        >
          {images.length > 0 ? (
            images.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.previewImage} />
            ))
          ) : (
            <TouchableOpacity onPress={pickImages}>
              <Text style={styles.textLight}>No image selected</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImages}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={takePhoto}
            disabled={uploading}
          >
            <Text style={[styles.buttonText, { color: COLORS.primary }]}>
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { marginTop: 15 }]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Upload to ImgBB</Text>
          )}
        </TouchableOpacity>

        {uploadedUrls.length > 0 && (
          <View style={styles.uploadedContainer}>
            <Text style={styles.uploadedText}>Uploaded Images:</Text>
            {uploadedUrls.map((url, idx) => (
              <TouchableOpacity key={idx} onPress={() => openLink(url)}>
                <Text style={styles.linkText}>{url}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {uploadedUrls.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, { marginTop: 15 }]}
            onPress={() => {
              setImages([]);
              setUploadedUrls([]);
            }}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  previewContainer: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 10,
  },
  textLight: { color: COLORS.textLight, fontSize: 14 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  uploadedContainer: { marginTop: 20, alignItems: 'center' },
  uploadedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: { color: 'red', fontSize: 14, fontWeight: '600' },
});
