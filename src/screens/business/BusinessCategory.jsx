import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
  useTheme,
  DeviceSize,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";
import { fetchBusinessCategories } from "../../redux/slices/mainSlice";

const ITEMS_PER_ROW = 4;

export default function BusinessCategory({ navigation, limit }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { token } = useSelector(state => state.auth);
  const { businessCategories: categories } =
    useSelector(state => state.main);

    const visibleCategories = limit
  ? categories.slice(0, limit)
  : categories;

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    if (token) {
      dispatch(fetchBusinessCategories(token));
    }
  }, [token]);

  return (
    <View style={styles.fullView}>
      {visibleCategories.map((item, index) => {
        const totalItems = categories.length;
        const remainingItems =
          totalItems % ITEMS_PER_ROW || ITEMS_PER_ROW;

        // 🔥 detect last row
        const isLastRow = index >= totalItems - remainingItems;

        // 🔥 width logic (SAME AS YOUR CODE)
        let itemWidth = DeviceSize.wp(23);
        if (isLastRow) {
          if (remainingItems === 1) itemWidth = DeviceSize.wp(23);
          if (remainingItems === 2) itemWidth = DeviceSize.wp(44);
          if (remainingItems === 3) itemWidth = DeviceSize.wp(23);
        }

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.schoolCategory,
              {
                width: itemWidth,
                // 🔹 BORDER LOGIC
                borderRightWidth:
                  (index + 1) % ITEMS_PER_ROW === 0 ? 0 : 1,

                borderBottomWidth: isLastRow ? 0 : 1,

                borderColor: colors.divider,
              },
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation?.navigate("BusinessSubCategory", {
                category: item,
              })
            }
          >
            <View style={[styles.cateImage, { backgroundColor: colors.cardBackground }]}>
              <Image
                source={{ uri: item.icon }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.catTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fullView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // paddingHorizontal: DeviceSize.wp(1),
  },

  schoolCategory: {
    alignItems: "center",
    paddingVertical: DeviceSize.hp(1),
    marginHorizontal: 0, // ❗ IMPORTANT (no gaps)
    borderRadius: 0,     // grid-style look
  },

  cateImage: {
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },

  logo: {
    width: DeviceSize.wp(8),
    height: DeviceSize.wp(8),
  },

  catTitle: {
    fontSize: FontSizes.nine,
    color: "#fff",
    fontFamily: Fonts.quicksand.bold,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 5, // 🔥 allows wrapping
  },
});
