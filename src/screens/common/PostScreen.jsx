import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../redux/slices/mainSlice";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import { useTheme, DeviceSize } from "../../theme/theme";
import { useNavigation } from "@react-navigation/native";

/* =====================================================
   POST / NEWS SCREEN
===================================================== */

export default function PostScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { token } = useSelector(state => state.auth);

  const {
    news,
    newsLoading,
    newsError,
  } = useSelector(state => state.main);

  // ✅ Load News
  const loadNews = useCallback(() => {
    if (!token) return;

    dispatch(fetchNews({ token, page: 1 }));
  }, [token]);

  useEffect(() => {
    loadNews();
  }, [token]);

  // ✅ Pull To Refresh
  const onRefresh = () => {
    loadNews();
  };

  // ✅ Loader (first load only)
  if (newsLoading && news.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* HEADER */}
      <AppHeader title="Posts" />

      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}

        refreshControl={
          <RefreshControl
            refreshing={newsLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]} // Android
            tintColor={colors.primary} // iOS
          />
        }

        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() =>
              navigation.navigate("PostDetail", {
                post: item,     // ✅ FULL DATA
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {item.title}
            </Text>

            {/* <Text style={[styles.desc, { color: colors.textSecondary }]}>
              {item.description.replace(/<[^>]*>/g, "")}
            </Text> */}

            <Text
              style={[styles.desc, { color: colors.textSecondary }]}
              numberOfLines={2}          // 👈 limit lines
              ellipsizeMode="tail"       // 👈 adds ...
            >
              {item.description.replace(/<[^>]*>/g, "")}
            </Text>

            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {item.createdDate}
            </Text>
          </TouchableOpacity>
        )}

        ListEmptyComponent={
          !newsLoading && (
            <EmptyState
              title="No posts found"
              image={require("../../../assets/images/feedback.png")}
            />
          )
        }
      />
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    margin: 10,
    padding: 10,
    borderRadius: 12,
  },

  image: {
    width: DeviceSize.hp(44),
    height: DeviceSize.hp(24),
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    marginBottom: 6,
  },

  date: {
    fontSize: 12,
  },
});
