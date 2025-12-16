import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RetrySnackbar from '../components/RetrySnackbar';
import FontAwesome from '@react-native-vector-icons/fontawesome';

type Photo = {
  id: string
  url_s: string
}

function HomePage({ navigation }: any) {

  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const CACHE_KEY = "photos";

  const fetchData = async (pageNumber: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (pageNumber === 1 && !isLoadMore) {
        const storedPhotos = await AsyncStorage.getItem(CACHE_KEY);
        if (storedPhotos) {
          setData(JSON.parse(storedPhotos));
        }
      }

      const res = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=${pageNumber}&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s`);

      if (!res.ok) {
        throw new Error('Network request failed');
      }

      const json = await res.json();
      const fetchedPhotos = json.photos.photo;
      console.log(`Fetched page ${pageNumber}:`, fetchedPhotos.length, 'photos');

      setData(prev => {
        const merged = pageNumber === 1 ? fetchedPhotos : [...prev, ...fetchedPhotos];
        const unique = merged.filter(
          (item: Photo, index: number, self: Photo[]) =>
            index === self.findIndex((p: Photo) => p.id === item.id)
        );
        return unique;
      });
      setPage(pageNumber);

      if (pageNumber === 1) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fetchedPhotos));
      }

    } catch (error) {
      console.log("Error fetching data:", error);
      setError('Network error. Please check your connection.');
      setRetryAction(() => () => fetchData(pageNumber, isLoadMore));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && !loading) {
      fetchData(page + 1, true);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {
        loading && data.length === 0 ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={'#3498db'} />
          </View>
          : (
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              renderItem={({ item }) => {
                return (
                  <View style={{ width: "45%", margin: 10, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    <Image source={{ uri: item.url_s }} style={{ width: '100%', height: 160 }} />
                  </View>
                );
              }}
            />
          )
      }
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Search")}>
        <FontAwesome name='search' color="#fff" size={25} />
      </TouchableOpacity>

      <RetrySnackbar
        visible={!!error}
        message={error || ''}
        onRetry={() => {
          if (retryAction) {
            retryAction();
          }
        }}
        onDismiss={() => setError(null)}
      />
    </View >
  );
}

export default HomePage;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0984e3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  fabIcon: {
    fontSize: 24,
    color: "white",
  }
})
