import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter } from 'lucide-react-native';
import { COLORS } from '@config/colors.config';
import { SPACING } from '@config/spacing.config';

import api from '@api/interceptor';
import { useFocusEffect } from '@react-navigation/native';
import AppText from '@views/components/AppText';
import AppButton from '@views/components/AppButton';
import AppChart, { ChartDatum } from '@views/components/AppChart';
import AppDropdown, { AppDropdownOption } from '@views/components/AppDropdown';
import AppDatePicker from '@views/components/AppDatePicker';
import PhoneNumberInput, { PhoneNumberValue } from '@views/components/PhoneNumberInput';
import AppBottomSheet, { AppBottomSheetRef } from '@views/components/AppBottomSheet';

interface Post {
  id: number;
  title: string;
  body: string;
}

const SORT_OPTIONS: AppDropdownOption[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Title (A-Z)', value: 'title' },
];

const PostsScreen = () => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Demo filter-sheet state — shows AppDropdown, AppDatePicker and
  // PhoneNumberInput together as a typical filter form.
  const filterSheetRef = useRef<AppBottomSheetRef>(null);
  const [sortBy, setSortBy] = useState<string | number | null>('newest');
  const [notifyDate, setNotifyDate] = useState<Date | null>(null);
  const [notifyPhone, setNotifyPhone] = useState<PhoneNumberValue>({
    countryCode: '+91',
    number: '',
  });

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

  // Demo chart data: body length per post, first 8 posts — just to show
  // AppChart wired to real data, not a meaningful metric on its own.
  const chartData: ChartDatum[] = useMemo(
    () =>
      posts.slice(0, 8).map(post => ({
        x: `#${post.id}`,
        y: post.body.length,
      })),
    [posts],
  );

  const renderChartHeader = useCallback(
    () =>
      chartData.length ? (
        <AppChart
          title="Post length (characters)"
          type="bar"
          data={chartData}
          height={180}
        />
      ) : null,
    [chartData],
  );

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
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <AppText bold size={24}>Recent Posts</AppText>
            <AppText variant="secondary">Stay updated with the latest news</AppText>
          </View>
          <AppButton
            label="Filters"
            variant="outline"
            size="sm"
            fullWidth={false}
            leftIcon={<Filter size={16} color={COLORS.primary} style={styles.filterIcon} />}
            onPress={() => filterSheetRef.current?.present()}
          />
        </View>
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
          ListHeaderComponent={renderChartHeader}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <AppText variant="secondary">No posts found</AppText>
            </View>
          }
        />
      )}

      <AppBottomSheet ref={filterSheetRef} title="Filter posts" snapPoints={['55%']}>
        <AppDropdown
          label="Sort by"
          data={SORT_OPTIONS}
          value={sortBy}
          onChange={item => setSortBy(item.value)}
        />
        <AppDatePicker
          label="Notify me starting"
          value={notifyDate}
          onChange={setNotifyDate}
          minimumDate={new Date()}
        />
        <PhoneNumberInput
          label="Notify via SMS (optional)"
          value={notifyPhone}
          onChange={setNotifyPhone}
        />
        <AppButton
          label="Apply filters"
          onPress={() => filterSheetRef.current?.dismiss()}
        />
      </AppBottomSheet>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    flex: 1,
  },
  filterIcon: {
    marginRight: SPACING.xs,
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
