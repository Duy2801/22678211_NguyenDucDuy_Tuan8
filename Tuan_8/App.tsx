import { ImageSourcePropType, View, StyleSheet, Alert, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AboutScreen from './components/AboutScreen';
import Ionicons from '@expo/vector-icons/Ionicons';


import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';


const PlaceholderImage = require('./assets/background-image.png');

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const viewShotRef = useRef<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      let uriToSave = selectedImage || RNImage.resolveAssetSource(PlaceholderImage).uri;

      if (viewShotRef.current) {
        try {
          const capturedUri = await viewShotRef.current.capture();
          if (capturedUri) uriToSave = capturedUri;
        } catch (e) {
          console.log('ViewShot failed (normal on web), using original image');
        }
      }
      const SAVED_KEY = '@edited_images';
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const updated = [uriToSave, ...list];
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));

      Alert.alert('✓ Saved!', 'Image saved! Check About tab.');
      setShowAppOptions(false);
      setSelectedImage(undefined);
      setPickedEmoji(undefined);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Save failed: ' + (e?.message || 'Unknown'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ alignItems: 'center' }}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </ViewShot>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'About') iconName = 'information-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
