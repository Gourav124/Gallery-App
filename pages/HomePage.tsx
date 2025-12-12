import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s"

type Photo = {
  id: string
  url_s: string
}

function HomePage() {

  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const CACH_KEY = "photos";

  const fetchData = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem(CACH_KEY);

      if (storedPhotos) {
        setData(JSON.parse(storedPhotos));
      }

      const res = await fetch(API_URL);
      const json = await res.json();
      const fetchedPhotos = json.photos.photo;
      console.log(json.photos.photo)

      if (JSON.stringify(fetchedPhotos) !== storedPhotos) {
        setData(fetchedPhotos)
        await AsyncStorage.setItem(CACH_KEY, JSON.stringify(fetchedPhotos));
      }

    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <View style={{ flex: 1,padding:16}}>
        {
          loading ?
            <ActivityIndicator size={'large'} color={'#3498db'}/>
            : (
              <FlatList
                data={data}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <View style={{ width: "45%", margin: 10 }}>
                      <Image source={{ uri: item.url_s }} style={{ width: 160, height: 160 }} />
                    </View>
                  );
                }}
              />
            )
        }
      </View>
  );
}

export default HomePage;
