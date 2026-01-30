import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import { useTheme } from "../../theme/theme";

/* =====================================================
   POST SCREEN
===================================================== */

export default function PostScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* HEADER */}
      <AppHeader title="Posts" />
      <EmptyState
        title="No posts found"
        image={require("../../../assets/images/feedback.png")}
      />
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ REQUIRED
  },

  body: {
    flex: 1, // ✅ IMPORTANT: gives space below header
    alignItems: 'center',
    justifyContent: 'center',
  },
});
