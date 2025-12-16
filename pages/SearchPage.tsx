import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import RetrySnackbar from '../components/RetrySnackbar';
import FontAwesome from '@react-native-vector-icons/fontawesome';

type Photo = {
  id: string;
  url_s: string;
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  const searchPhotos = async (query: string) => {

    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      Keyboard.dismiss();

      const res = await fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s&text=${encodeURIComponent(
          query
        )}&per_page=50`
      );

      const json = await res.json();
      const fetchedPhotos = json.photos.photo;
      console.log(fetchedPhotos.length);
      setData(fetchedPhotos);
    } catch (error) {
      console.log('Error', error);
      setError('Network error. Please check your connection.');
      setRetryAction(() => () => searchPhotos(query));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchPhotos(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setData([]);
    setSearched(false);
    setError(null);
  };

  const renderEmptyState = () => {
    if (loading) return null;

    if (!searched) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <FontAwesome name='search' color="#000" size={45} />
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#2c3e50', marginTop: 16, }}>Search for Photos</Text>
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#2c3e50', marginTop: 16, }}>No Results Found</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', }}>
      <View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', gap: 8 }}>
        <View style={{ flex: 1, position: 'relative' }}>
          <TextInput
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingRight: 40,
              paddingVertical: 12,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            placeholder="Search photos (e.g., cat, dog, nature)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: 12 }}
              onPress={handleClear}
              disabled={loading}
            >
              <FontAwesome name="times-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchButton, !searchQuery.trim() && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FontAwesome name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{marginTop: 12,color: '#3498db',fontSize: 16,}}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 8, flexGrow: 1 }}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => {
            return (
              <View style={{ width: '45%', margin: 10, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                <Image source={{ uri: item.url_s }} style={{ width: '100%', height: 160 }} />
              </View>
            );
          }}
        />
      )}

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
    </View>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
});