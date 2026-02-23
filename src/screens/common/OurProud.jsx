import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";

/* 🔹 Redux */
import { fetchOurProud } from "../../redux/slices/commonSlice";

import {
  useTheme,
  Spacing,
  Fonts,
  FontSizes,
  BorderRadius,
} from "../../theme/theme";

/* =====================================================
   OUR PROUD SCREEN
===================================================== */

const OurProud = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { token } = useSelector((state) => state.auth);
  const {
    ourProud,
    ourProudLoading,
  } = useSelector((state) => state.common);

  useEffect(() => {
    if (token) {
      dispatch(fetchOurProud(token));
    }
  }, [token, dispatch]);

  const onRefresh = useCallback(() => {
    if (token) {
      dispatch(fetchOurProud(token));
    }
  }, [token, dispatch]);

   const makeCall = (number) => {
      if (!number) return;
      Linking.openURL(`tel:${number}`);
    };

  const renderItem = ({ item }) => (
    <View style={styles.ourProudsBox}>
      <View
        style={[
          styles.ourProudsLists,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        {/* 🔹 TOP SECTION */}
        <View style={styles.ourProudLeft}>
          <Image
            source={{ uri: item.image }}
            style={styles.ourProudLeftImage}
          />

          <Text
            style={[
              styles.ourProudDesription,
              { color: colors.textPrimary },
            ]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.description || "Description not available"}
          </Text>
        </View>

        {/* 🔹 DETAILS TABLE */}
        <View
          style={[
            styles.ourProudRight,
            { borderColor: colors.divider },
          ]}
        >
          {renderRow("नाम", item.name, colors)}
          {renderRow("पद", item.designation, colors)}
          {renderRow("ईमेल", item.email, colors)}
          {renderRow("संपर्क नंबर", item.call, colors)}
        </View>
      </View>
    </View>
  );

  if (ourProudLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader title="Our Proud" />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: 75, }}>
      <AppHeader title="Our Proud" />

      <FlatList
        data={ourProud}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          ourProud.length === 0 ? { flex: 1 } : undefined
        }
        refreshControl={
          <RefreshControl
            refreshing={ourProudLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState title="No Proud Members Found" />
        }
      />
    </SafeAreaView>
  );
};

export default OurProud;

/* =====================================================
   REUSABLE ROW
===================================================== */

const renderRow = (label, value, colors) => (
  <View
    style={[
      styles.ourProudtRightSection,
      { borderBottomColor: colors.divider },
    ]}
  >
    <Text
      style={[
        styles.ourProudPostText,
        { color: colors.textSecondary },
      ]}
    >
      {label} :-
    </Text>

    <View
      style={[
        styles.ourProudBorder,
        { backgroundColor: colors.divider },
      ]}
    />

    <Text
      style={[
        styles.ourProudPersonName,
        { color: colors.textPrimary },
      ]}
      
    >
      {value || "Not available"}
    </Text>
  </View>
);

/* =====================================================
   STYLES (THEME-DRIVEN)
===================================================== */

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },

  ourProudsBox: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  ourProudsLists: {
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
  },

  ourProudLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  ourProudLeftImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.medium,
    resizeMode: "cover",
  },

  ourProudDesription: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    lineHeight: 18,
    paddingLeft: Spacing.sm,
    width: "70%",
  },

  ourProudRight: {
    marginTop: Spacing.sm,
    borderWidth: 1,
  },

  ourProudtRightSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },

  ourProudPostText: {
    width: "28%",
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    paddingLeft: 6,
  },

  ourProudPersonName: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    flex: 1,
  },

  ourProudBorder: {
    height: "100%",
    width: 1,
    marginHorizontal: Spacing.sm,
  },
});
