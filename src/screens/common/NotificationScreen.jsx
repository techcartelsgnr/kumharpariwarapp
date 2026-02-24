import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";

import { fetchNotifications } from "../../redux/slices/commonSlice";
import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import { useTheme, Fonts, FontSizes } from "../../theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  const token = useSelector((state) => state.auth?.token);

  const {
    notifications,
    notificationsLoading,
  } = useSelector((state) => state.common);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications(token));
    }
  }, [dispatch, token]);

  // 🔄 Pull to refresh
  const onRefresh = useCallback(() => {
    if (!token) return;
    setPending(true);
    dispatch(fetchNotifications(token)).finally(() => {
      setPending(false);
    });
  }, [dispatch, token]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.textPrimary },
        ]}
      >
        {item.title}
      </Text>

      {/* ✅ HTML MESSAGE */}
      <RenderHTML
        contentWidth={width}
        source={{ html: item.message }}
        baseStyle={{
          color: colors.textSecondary,
          fontFamily: Fonts.quicksand.medium,
          fontSize: FontSizes.small,
        }}
      />

    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Notifications" />

      {notificationsLoading && !pending && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 24 }}
        />
      )}

      {!notificationsLoading && notifications.length === 0 && (
        <EmptyState
          title="No Notifications"
          image={require("../../../assets/images/feedback.png")}
        />
      )}

      {!notificationsLoading && notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={pending}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
    marginBottom: 5,
  },
//   time: {
//     fontFamily: Fonts.quicksand.medium,
//     fontSize: FontSizes.nine,
//     marginTop: 6,
//     alignSelf: "flex-end",
//   },
});
