import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { FontSizes, Fonts, Spacing, useTheme } from "../theme/theme";

const AppHeader = ({ title, showBack = true }) => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      {/* ✅ STATUS BAR — SINGLE SOURCE OF TRUTH */}
      <StatusBar
        translucent={false}
        backgroundColor={colors.cardBackground}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </>
  );
};

export default AppHeader;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },

  backButton: {
    position: "absolute",
    left: Spacing.md,
    zIndex: 10,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    textAlign: "center",
    marginLeft: 10,
    flexWrap: 'wrap',
  },
});
