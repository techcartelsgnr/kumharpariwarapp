import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import AppHeader from "../../components/AppHeader";
import PaginatedList from "../../components/PaginatedList";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

import { fetchBusinessSubCategories } from "../../redux/slices/mainSlice";

/* =====================================================
   BUSINESS SUB CATEGORY SCREEN
===================================================== */

const BusinessSubCategory = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  // 🔹 category data from previous screen
  const { category } = route.params;
  const businessId = category?.id;

  const { token } = useSelector(state => state.auth);
  const {
    businessSubCategories,
    loadingSubCategories,
  } = useSelector(state => state.main);

  /* ============================
     FETCH SUB CATEGORIES
  ============================ */
  useEffect(() => {
    if (token && businessId) {
      dispatch(
        fetchBusinessSubCategories({
          token,
          businessId,
        })
      );
    }
  }, [token, businessId]);

  /* ============================
     RENDER ITEM
  ============================ */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ContactsList", {
          subCategory: item,
        })
      }
      style={[
        styles.item,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.divider,
        },
      ]}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.title,
          { color: colors.textPrimary },
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* 🔹 HEADER */}
      <AppHeader title={category?.name || "Sub Categories"} />

      {/* 🔹 PAGINATED LIST */}
      <PaginatedList
        data={businessSubCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        pageSize={10}
        emptyTitle="No sub categories found"
      />
    </View>
  );
};

export default BusinessSubCategory;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginHorizontal: Spacing.smt,
    marginTop: Spacing.sm,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },
});
