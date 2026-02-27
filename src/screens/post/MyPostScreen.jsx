import React, { useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  useTheme,
  Spacing,
  FontSizes,
  DeviceSize,
  Fonts,
} from "../../theme/theme";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import RenderHTML from "react-native-render-html";

/* ✅ Lucide Icons */
import {
  Pencil,
  Trash2,
} from "lucide-react-native";

import {
  fetchNewsByUserSlice,
  deleteNewsByUserSlice,
} from "../../redux/slices/commonSlice";

import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPostScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token } = useSelector(state => state.auth);
  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  const {
    news,
    newsLoading,
    newsPagination,
  } = useSelector(state => state.common);

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    loadNews(1);
  }, []);

  const loadNews = (page) => {
    dispatch(fetchNewsByUserSlice({ token, page }));
  };

  /* ===============================
     REFRESH
  =============================== */
  const onRefresh = useCallback(() => {
    loadNews(1);
  }, []);

  /* ===============================
     PAGINATION
  =============================== */
  const loadMore = () => {
    if (
      !newsLoading &&
      newsPagination.currentPage < newsPagination.lastPage
    ) {
      loadNews(newsPagination.currentPage + 1);
    }
  };

  /* ===============================
     ACTIONS
  =============================== */
  const handleEdit = (item) => {
    navigation.navigate("EditMyPost", { news: item });
  };

  const handleDelete = (item) => {
    dispatch(deleteNewsByUserSlice({
      token,
      news_id: item.id,
    }));
  };

  /* ===============================
     RENDER ITEM
  =============================== */
  const renderItem = ({ item }) => {
    const description = item.desp?.slice(0, 200) || "";
    const imageUrl = item.image;
    const title = item.title || "No Title";
    const createdAt = item.created_date || "No Date";

    return (
      <View
        style={[
          styles.newsSection,
          { backgroundColor: colors.cardBackground }
        ]}
      >
        <View style={styles.newsTopSection}>
          <View style={styles.newsLeft}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.newsImage}
              />
            ) : (
              <View
                style={[
                  styles.newsImage,
                  { backgroundColor: colors.surface }
                ]}
              />
            )}
          </View>

          <View style={styles.newsRight}>
            <Text
              numberOfLines={2}
              style={[
                styles.newsCateLabel,
                { color: colors.textPrimary }
              ]}
            >
              {title}
            </Text>

            <RenderHTML
              contentWidth={width}
              source={{ html: description }}
              baseStyle={{
                color: colors.textSecondary,
                fontSize: FontSizes.small,
                lineHeight: 20,
              }}
              tagsStyles={{
                p: {
                  fontSize: FontSizes.small,
                  fontFamily: Fonts.quicksand.regular,
                  color: colors.textSecondary,
                  lineHeight: 22,
                },
                b: { fontWeight: "800" },
                strong: { fontWeight: "900" },
              }}
            />
          </View>
        </View>

        <View style={styles.newsBottomSection}>
          <Text
            style={[
              styles.newsDateLabel,
              { color: colors.textTertiary }
            ]}
          >
            {createdAt}
          </Text>

          <View style={styles.newsBottomRight}>
            {/* ✅ EDIT */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
            >
              <Pencil size={14} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>

            {/* ✅ DELETE */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item)}
            >
              <Trash2 size={14} color={colors.error} />
              <Text style={[styles.deleteText, { color: colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="My Posts" />

      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}

        /* ✅ EMPTY STATE */
        ListEmptyComponent={
          !newsLoading && (
            <EmptyState
              title="No Record Found"
              image={require("../../../assets/images/feedback.png")}
            />
          )
        }

        /* ✅ FOOTER LOADER */
        ListFooterComponent={
          newsLoading && news.length > 0 ? (
            <ActivityIndicator
              style={{ marginVertical: Spacing.md }}
              color={colors.primary}
            />
          ) : null
        }

        /* ✅ REFRESH */
        refreshControl={
          <RefreshControl
            refreshing={newsLoading && newsPagination.currentPage === 1}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }

        /* ✅ PAGINATION */
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  newsSection: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 14,
  },

  newsTopSection: {
    flexDirection: "row",
  },

  newsLeft: {
    marginRight: Spacing.sm,
  },

  newsRight: {
    flex: 1,
  },

  newsImage: {
    width: DeviceSize.wp(22),
    height: DeviceSize.wp(22),
    borderRadius: 10,
  },

  newsCateLabel: {
    fontSize: FontSizes.medium,
    marginBottom: 4,
    fontFamily: Fonts.quicksand.bold,
  },

  newsBottomSection: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  newsBottomRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  newsDateLabel: {
    fontSize: FontSizes.tiny,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
  },

  deleteText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
  },
});