import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@config/colors.config';

import api from '@api/interceptor';
import { useFocusEffect } from '@react-navigation/native';
import AppText from '@views/components/AppText';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostsScreen = () => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.log('[PostsScreen] Error fetching posts:', error);
      // We don't show a Toast here if it's a network error, 
      // because our global NetworkBanner will handle it.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <AppText bold size={16} style={styles.postTitle}>{item.title}</AppText>
      <AppText variant="secondary" size={14}>{item.body}</AppText>
    </View>
  );

  return (
    <View style={[styles.mainContainer, { 
    }]}>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <AppText bold size={24}>Recent Posts</AppText>
        <AppText variant="secondary">Stay updated with the latest news</AppText>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <AppText variant="secondary">No posts found</AppText>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light grey background for cards
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});

export default PostsScreen;
