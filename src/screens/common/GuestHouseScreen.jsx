import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";

import {
  useTheme,
  Spacing,
  FontSizes,
  Fonts,
  BorderRadius,
  Shadows,
} from "../../theme/theme";

import { fetchGuestHouses } from "../../redux/slices/mainSlice";

/* =====================================================
   GUEST HOUSE SCREEN
===================================================== */

const GuestHouseScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  /* ===============================
     REDUX STATE
  =============================== */
  const {
    guestHouses,
    guestHousesLoading,
    guestHousePagination,
  } = useSelector(state => state.main);

  // 🔐 GET TOKEN FROM AUTH SLICE
  const { token } = useSelector(state => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    if (token) {
      dispatch(fetchGuestHouses({ page: 1, token }));
    }
  }, [dispatch, token]);

  /* ===============================
     PULL TO REFRESH
  =============================== */
  const onRefresh = useCallback(() => {
    if (!token) return;

    setRefreshing(true);
    dispatch(fetchGuestHouses({ page: 1, token }))
      .finally(() => setRefreshing(false));
  }, [dispatch, token]);

  /* ===============================
     LOAD MORE (INFINITE SCROLL)
  =============================== */
  const loadMore = () => {
    if (
      token &&
      guestHousePagination.nextPage &&
      !guestHousesLoading
    ) {
      dispatch(
        fetchGuestHouses({
          page: guestHousePagination.nextPage,
          token,
        })
      );
    }
  };

  /* ===============================
     RENDER ITEM
  =============================== */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("GuestHouseDetail", {
          guestHouse: item,
        })
      }
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.address,
            { color: colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {item.address}
        </Text>

        <Text
          style={[
            styles.city,
            { color: colors.textTertiary },
          ]}
        >
          {item.city}, {item.state}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ===============================
     FOOTER LOADER
  =============================== */
  const ListFooterComponent = () => {
    if (!guestHousesLoading || refreshing) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      </View>
    );
  };

  /* ===============================
     EMPTY STATE
  =============================== */
  if (!guestHousesLoading && guestHouses.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          { backgroundColor: colors.background },
        ]}
      >
        <AppHeader title="Guest Houses" />
        <EmptyState title="No Guest Houses Available" />
      </SafeAreaView>
    );
  }

  /* ===============================
     MAIN UI
  =============================== */
  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      <AppHeader title="Guest Houses" />

      <FlatList
        data={guestHouses}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={ListFooterComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

export default GuestHouseScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  list: {
    padding: Spacing.md,
  },

  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.md,
    overflow: "hidden",
    ...Shadows.small,
  },

  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
  },

  content: {
    padding: Spacing.md,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
    marginBottom: Spacing.xs,
  },

  address: {
    fontFamily: Fonts.quicksand.regular,
    fontSize: FontSizes.small,
    marginBottom: Spacing.sm,
  },

  city: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.xsmall,
  },

  footerLoader: {
    paddingVertical: 20,
  },
});
