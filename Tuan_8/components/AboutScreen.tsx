import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_KEY = '@edited_images';

export default function AboutScreen() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SAVED_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const reload = async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      if (raw) setItems(JSON.parse(raw)); else setItems([]);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edited Images</Text>
      <TouchableOpacity onPress={reload} style={{ marginBottom: 12 }}>
        <Text style={{ color: '#ffd700' }}>Refresh</Text>
      </TouchableOpacity>
      {items.length === 0 ? (
        <Text style={{ color: '#ccc' }}>No edited images yet. Save an image from Home and press Refresh.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i}
          renderItem={({ item }) => (
            <View style={{ padding: 8 }}>
              <Image source={{ uri: item }} style={{ width: 200, height: 200, borderRadius: 8 }} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e', padding: 12 },
  title: { color: 'white', fontSize: 18, marginBottom: 12 },
});

