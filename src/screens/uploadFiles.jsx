import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  UploadCloud,
  File,
  Trash2,
  ArrowUp,
  Copy,
  ExternalLink,
} from 'lucide-react-native';
import { pick } from '@react-native-documents/picker';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const UploadFiles = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async () => {
    try {
      setUploadStatus(null);
      setUploadedFiles([]);
      setErrorMessage('');

      const results = await pick({ allowMultiSelection: true });
      if (!results || results.length === 0) return;

      // Add all picked files with progress initialized
      setFiles(prev => [
        ...prev,
        ...results.map(file => ({ ...file, progress: 0 })),
      ]);

      console.log('Selected files:', results);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setUploadStatus(null);
    setIsUploading(false);
    setUploadedFiles([]);
    setErrorMessage('');
  };

  const handleUploadFiles = async () => {
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadedFiles([]);
    setErrorMessage('');

    try {
      const uploadResults = [];

      for (const [index, file] of files.entries()) {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/octet-stream',
        });

        const uploadResponse = await axios.post(
          'https://filefa.st/api/v1/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: progressEvent => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100,
                );

                setFiles(prev =>
                  prev.map((f, i) => (i === index ? { ...f, progress } : f)),
                );
              }
            },
          },
        );

        // Check if response is successful
        if (uploadResponse.data.status === true) {
          // Set progress to 100% after successful upload
          setFiles(prev =>
            prev.map((f, i) => (i === index ? { ...f, progress: 100 } : f)),
          );

          uploadResults.push({
            name: file.name,
            url: uploadResponse.data.data.file.url.full,
            shortUrl: uploadResponse.data.data.file.url.short,
            size: uploadResponse.data.data.file.metadata.size.readable,
            id: uploadResponse.data.data.file.metadata.id,
          });

          console.log(`✅ Uploaded ${file.name}`);
          console.log('Response:', uploadResponse.data);
        } else {
          // Handle API error response
          throw new Error(
            uploadResponse.data.errors?.file?.[0] || 'Upload failed',
          );
        }
      }

      setUploadedFiles(uploadResults);
      setUploadStatus('success');
      setIsUploading(false);
    } catch (error) {
      console.error('❌ Upload failed:', error.response?.data || error.message);

      // Extract error message from API response
      let errorMsg = 'Upload failed. Please try again.';
      if (error.response?.data?.errors?.file) {
        errorMsg = error.response.data.errors.file[0];
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      setUploadStatus('error');
      setIsUploading(false);
    }
  };

  const handleRemove = uri => {
    setFiles(files.filter(file => file.uri !== uri));
  };

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <UploadCloud size={40} color={theme.primary} />
        <Text style={styles.title}>Upload Your Files</Text>
        <Text style={styles.subtitle}>
          Select documents, images, or any files you want to upload.
        </Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelect}>
        <Text style={styles.uploadText}>Select File</Text>
      </TouchableOpacity>

      {files.length > 0 ? (
        <View style={styles.filesList}>
          <View style={styles.filesHeader}>
            <Text style={styles.filesCount}>
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </Text>
          </View>

          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileHeader}>
                <View style={styles.fileInfo}>
                  <File size={22} color={theme.primary} />
                  <Text numberOfLines={1} style={styles.fileName}>
                    {file.name || 'Unnamed File'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemove(file.uri)}
                  disabled={isUploading}
                  style={styles.deleteButton}
                >
                  <Trash2
                    size={20}
                    color={
                      isUploading ? theme.textSecondary : theme.error || 'red'
                    }
                  />
                </TouchableOpacity>
              </View>

              {file.progress > 0 && (
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${file.progress}%`,
                        backgroundColor:
                          file.progress === 100 ? '#10b981' : theme.primary,
                      },
                    ]}
                  />
                  <Text style={styles.progressText}>{file.progress}%</Text>
                </View>
              )}
            </View>
          ))}

          {uploadStatus !== 'success' ? (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                isUploading && styles.uploadButtonDisabled,
              ]}
              onPress={handleUploadFiles}
              disabled={isUploading}
            >
              <View style={styles.uploadButtonContent}>
                <Text style={styles.uploadText}>
                  {isUploading ? 'Uploading...' : 'Upload to Cloud'}
                </Text>
                {!isUploading && (
                  <ArrowUp
                    size={22}
                    color={theme.white}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <UploadCloud size={48} color={theme.textSecondary || '#888'} />
          <Text style={styles.emptyText}>No files selected yet.</Text>
          <Text style={styles.emptySubtext}>
            Tap "Select File" to get started
          </Text>
        </View>
      )}

      {uploadStatus === 'success' && uploadedFiles.length > 0 && (
        <View style={styles.statusContainer}>
          {/* <LottieView
            source={require('../../assets/images/success.json')}
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          /> */}
          <Text style={styles.successText}>Upload Successful!</Text>

          <View style={styles.uploadedFilesList}>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={styles.uploadedFileItem}>
                <View style={styles.uploadedFileHeader}>
                  <File size={18} color={theme.primary} />
                  <Text style={styles.uploadedFileName}>{file.name}</Text>
                  <Text style={styles.uploadedFileSize}>{file.size}</Text>
                </View>

                <View style={styles.urlContainer}>
                  <Text style={styles.urlLabel}>Full URL:</Text>
                  <TouchableOpacity
                    style={styles.urlRow}
                    onPress={() => copyToClipboard(file.url, 'Full URL')}
                  >
                    <Text style={styles.urlText} numberOfLines={1}>
                      {file.url}
                    </Text>
                    <Copy size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.urlContainer}>
                  <Text style={styles.urlLabel}>Short URL:</Text>
                  <TouchableOpacity
                    style={styles.urlRow}
                    onPress={() => copyToClipboard(file.shortUrl, 'Short URL')}
                  >
                    <Text style={styles.urlText} numberOfLines={1}>
                      {file.shortUrl}
                    </Text>
                    <Copy size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {uploadStatus === 'error' && files.length > 0 && (
        <View style={styles.statusContainer}>
          <LottieView
            source={require('../../assets/images/error.json')}
            autoPlay
            loop={true}
            // delayMS={1000}
            style={styles.lottieAnimation}
          />
          <Text style={styles.errorText}>Upload Failed</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default UploadFiles;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.text,
      marginTop: 12,
    },
    subtitle: {
      color: theme.textSecondary || '#888',
      textAlign: 'center',
      marginTop: 6,
      fontSize: 14,
    },
    uploadButton: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    uploadText: {
      color: theme.white,
      fontWeight: '600',
      fontSize: 16,
    },
    clearButton: {
      backgroundColor: '#dc2626',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    clearButtonText: {
      color: "#fff",
      fontWeight: '600',
      fontSize: 16,
    },
    filesList: {
      gap: 16,
    },
    filesHeader: {
      marginBottom: 8,
    },
    filesCount: {
      color: theme.textSecondary || '#888',
      fontSize: 14,
      fontWeight: '500',
    },
    fileItem: {
      backgroundColor: theme.card || '#1E1E1E10',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border || '#ddd',
    },
    fileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 10,
    },
    fileName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
      flex: 1,
    },
    deleteButton: {
      padding: 4,
    },
    progressContainer: {
      height: 8,
      backgroundColor: theme.border || '#ddd',
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 12,
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 11,
      color: theme.textSecondary || '#888',
      marginTop: 4,
      textAlign: 'right',
      fontWeight: '600',
    },
    uploadButtonDisabled: {
      opacity: 0.6,
    },
    uploadButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyBox: {
      borderWidth: 2,
      borderColor: theme.border || '#ccc',
      borderStyle: 'dashed',
      padding: 40,
      alignItems: 'center',
      borderRadius: 12,
      gap: 8,
    },
    emptyText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
      marginTop: 12,
    },
    emptySubtext: {
      color: theme.textSecondary || '#888',
      fontSize: 14,
    },
    statusContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    lottieAnimation: {
      width: 100,
      height: 100,
    },
    successText: {
      color: '#10b981',
      fontSize: 18,
      fontWeight: '600',
      marginTop: 8,
      marginBottom: 16,
    },
    errorText: {
      color: theme.error || 'red',
      fontSize: 18,
      fontWeight: '600',
      marginTop: 8,
    },
    errorMessage: {
      color: theme.error || 'red',
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    uploadedFilesList: {
      width: '100%',
      gap: 16,
      marginTop: 8,
    },
    uploadedFileItem: {
      backgroundColor: theme.card || '#1E1E1E10',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#10b981',
      gap: 12,
    },
    uploadedFileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    uploadedFileName: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '600',
      flex: 1,
    },
    uploadedFileSize: {
      color: theme.textSecondary || '#888',
      fontSize: 12,
      fontWeight: '500',
    },
    urlContainer: {
      gap: 6,
    },
    urlLabel: {
      color: theme.textSecondary || '#888',
      fontSize: 12,
      fontWeight: '500',
    },
    urlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 10,
      borderRadius: 8,
      gap: 8,
    },
    urlText: {
      color: theme.primary,
      fontSize: 13,
      flex: 1,
      fontWeight: '500',
    },
  });
