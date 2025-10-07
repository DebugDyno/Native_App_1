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

import { useTheme } from '../context/ThemeContext'; // theme context
import { CircleX } from 'lucide-react-native';

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

  const { theme } = useTheme();

  const styles = getStyles(theme);

  const pickImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        console.log(response);
        const uris = response.assets.map(asset => asset.uri);
        setImages(uris);
        setUploadedUrls([]);
      }
    });
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

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
      <View style={styles.previewContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.previewContent}
          showsHorizontalScrollIndicator={false}
        >
          {images.length > 0 ? (
            images.map((uri, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(idx)}
                >
                  <CircleX size={20} color="red" />
                </TouchableOpacity>
              </View>
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
            <Text style={[styles.buttonText, { color: theme.primary }]}>
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              marginTop: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <ActivityIndicator
                color={theme.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Uploading...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Upload to ImgBB</Text>
          )}
        </TouchableOpacity>

        {uploadedUrls.length > 0 && (
          <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
            <Text style={styles.uploadedText}>Uploaded Images:</Text>
            <ScrollView
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.uploadedPreviewContainer}
            >
              {uploadedUrls.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => openLink(url)}
                  style={styles.uploadedItem}
                >
                  <Image source={{ uri: url }} style={styles.uploadedImage} />
                  <Text style={styles.linkText} numberOfLines={1}>
                    {url}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      padding: 14,
    },
    previewContainer: {
      width: '100%',
      height: 200,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      marginBottom: 20,
      backgroundColor: theme.card,
      shadowColor: theme.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
    },
    previewImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    removeButton: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.white,
      borderRadius: 12,
    },
    textLight: { color: theme.textLight, fontSize: 14 },
    buttonRow: { flexDirection: 'row', gap: 10 },
    button: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondary: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 8,
    },
    buttonText: { color: theme.white, fontSize: 14, fontWeight: '600' },
    uploadedContainer: { marginTop: 20, alignItems: 'center' },
    uploadedText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 5,
    },
    linkText: {
      color: theme.primary,
      textDecorationLine: 'underline',
      fontSize: 14,
    },
    clearButton: {
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    clearButtonText: { color: 'red', fontSize: 14, fontWeight: '600' },
    uploadedPreviewContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 15,
      paddingBottom: 30,
      width: '100%',
    },

    uploadedItem: {
      width: '90%',
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },

    uploadedImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      resizeMode: 'cover',
      marginBottom: 6,
    },
  });
